#!/bin/bash
#
# Titan — Datenbank-Backup (pg_dump aus dem Postgres-Container).
#
# Bewusst unabhängig vom Hoster und von Verwaltungspanels (Plesk & Co. kennen
# unsere Docker-Container nicht). Ein pg_dump ist präzise (nur unsere DB),
# granular wiederherstellbar und kostenlos.
#
# Ablauf: dump -> gzip -> [optional verschlüsseln] -> Rotation
#         -> [optional off-site] -> [optional Heartbeat-Ping]
#
# Aufruf auf dem VPS (siehe docs/deployment.md):
#   ./scripts/backup.sh
#
# Konfiguration über Umgebungsvariablen (alles optional außer den Defaults):
#   BACKUP_DIR        Zielverzeichnis           (Default: /var/backups/titan)
#   PG_CONTAINER      Name des DB-Containers    (Default: titan-postgres)
#   KEEP_DAILY        tägliche Dumps behalten   (Default: 7)
#   BACKUP_PASSPHRASE wenn gesetzt -> Dump wird GPG-symmetrisch verschlüsselt
#                     (PFLICHT, sobald off-site: es sind personenbezogene Daten)
#   RCLONE_REMOTE     z.B. "scaleway:titan-backups" -> Off-site-Kopie via rclone
#   HEARTBEAT_URL     wird bei Erfolg gepingt (Totmannschalter, s.u.)
#
# WARUM Heartbeat: Ein still fehlschlagender Backup-Cron ist schlimmer als gar
# keiner — man wiegt sich in Sicherheit und merkt es erst beim Restore. Bleibt
# der Ping aus, schlägt der Monitoring-Dienst Alarm.

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/titan}"
PG_CONTAINER="${PG_CONTAINER:-titan-postgres}"
KEEP_DAILY="${KEEP_DAILY:-7}"

STAMP="$(date +%Y-%m-%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

fail() {
  echo "[backup] FEHLER: $*" >&2
  # Kein Heartbeat-Ping im Fehlerfall -> Monitoring schlägt an.
  exit 1
}

# ── Zugangsdaten aus dem laufenden Container ziehen ──────────────────────
# Vermeidet doppelte Pflege von Passwörtern in Cron/Skript.
command -v docker >/dev/null 2>&1 || fail "docker nicht gefunden"
docker inspect "$PG_CONTAINER" >/dev/null 2>&1 || fail "Container '$PG_CONTAINER' läuft nicht"

PG_USER="$(docker exec "$PG_CONTAINER" printenv POSTGRES_USER)"
PG_DB="$(docker exec "$PG_CONTAINER" printenv POSTGRES_DB)"
[ -n "$PG_USER" ] && [ -n "$PG_DB" ] || fail "POSTGRES_USER/POSTGRES_DB nicht aus dem Container lesbar"

OUT="$BACKUP_DIR/titan_${STAMP}.sql.gz"

# ── Dump ─────────────────────────────────────────────────────────────────
echo "[backup] Dump ${PG_DB} -> ${OUT}"
docker exec "$PG_CONTAINER" pg_dump -U "$PG_USER" -d "$PG_DB" --clean --if-exists \
  | gzip -9 > "$OUT" || fail "pg_dump fehlgeschlagen"

# Plausibilitätsprüfung: ein leerer/winziger Dump deutet auf einen Fehler hin.
SIZE=$(wc -c < "$OUT")
[ "$SIZE" -gt 500 ] || fail "Dump verdächtig klein (${SIZE} Bytes)"

# ── Optional: verschlüsseln (Pflicht sobald off-site) ────────────────────
if [ -n "${BACKUP_PASSPHRASE:-}" ]; then
  command -v gpg >/dev/null 2>&1 || fail "gpg nicht installiert (für BACKUP_PASSPHRASE nötig)"
  echo "[backup] Verschlüssele ..."
  gpg --batch --yes --symmetric --cipher-algo AES256 \
      --passphrase "$BACKUP_PASSPHRASE" -o "${OUT}.gpg" "$OUT" || fail "Verschlüsselung fehlgeschlagen"
  rm -f "$OUT"
  OUT="${OUT}.gpg"
fi

echo "[backup] OK: $OUT ($(du -h "$OUT" | cut -f1))"

# ── Rotation ─────────────────────────────────────────────────────────────
# Behält die neuesten KEEP_DAILY Dumps, löscht ältere.
COUNT=$(find "$BACKUP_DIR" -maxdepth 1 -name 'titan_*.sql.gz*' -type f | wc -l | tr -d ' ')
if [ "$COUNT" -gt "$KEEP_DAILY" ]; then
  find "$BACKUP_DIR" -maxdepth 1 -name 'titan_*.sql.gz*' -type f -print0 \
    | xargs -0 ls -1t \
    | tail -n +$((KEEP_DAILY + 1)) \
    | while read -r old; do echo "[backup] Rotation: entferne $(basename "$old")"; rm -f "$old"; done
fi

# ── Optional: Off-site-Kopie ─────────────────────────────────────────────
# Ein Dump, der nur auf dem VPS liegt, überlebt den Verlust des VPS nicht.
if [ -n "${RCLONE_REMOTE:-}" ]; then
  # Sicherheitsregel ZUERST — sie darf nicht davon abhängen, ob rclone da ist.
  if [ -z "${BACKUP_PASSPHRASE:-}" ]; then
    fail "Off-site ohne BACKUP_PASSPHRASE abgelehnt — personenbezogene Daten dürfen nicht unverschlüsselt zu Dritten."
  fi
  command -v rclone >/dev/null 2>&1 || fail "rclone nicht installiert (für RCLONE_REMOTE nötig)"
  echo "[backup] Kopiere off-site -> ${RCLONE_REMOTE}"
  rclone copy "$OUT" "$RCLONE_REMOTE" || fail "Off-site-Kopie fehlgeschlagen"
fi

# ── Optional: Heartbeat (nur bei vollem Erfolg) ──────────────────────────
if [ -n "${HEARTBEAT_URL:-}" ]; then
  curl -fsS -m 10 "$HEARTBEAT_URL" >/dev/null 2>&1 || echo "[backup] Warnung: Heartbeat-Ping fehlgeschlagen" >&2
fi

echo "[backup] Fertig."
