#!/bin/bash
#
# Titan — Datenbank-Restore aus einem Dump von scripts/backup.sh
#
# Existiert bewusst als eigenes Skript: Ein Backup, dessen Wiederherstellung
# nie geprobt wurde, ist nur ein Versprechen. Diesen Weg mindestens EINMAL
# echt durchspielen (idealerweise gegen eine Wegwerf-DB), nicht erst im Ernstfall.
#
# Aufruf:
#   ./scripts/restore.sh /var/backups/titan/titan_2026-07-15_030000.sql.gz
#   BACKUP_PASSPHRASE=... ./scripts/restore.sh <datei>.sql.gz.gpg
#
#   PG_CONTAINER   Ziel-Container (Default: titan-postgres)
#   FORCE=1        überspringt die Rückfrage (für Automatisierung/Tests)

set -euo pipefail

FILE="${1:-}"
PG_CONTAINER="${PG_CONTAINER:-titan-postgres}"

[ -n "$FILE" ] || { echo "Aufruf: $0 <dump-datei>" >&2; exit 1; }
[ -f "$FILE" ] || { echo "Datei nicht gefunden: $FILE" >&2; exit 1; }
docker inspect "$PG_CONTAINER" >/dev/null 2>&1 || { echo "Container '$PG_CONTAINER' läuft nicht" >&2; exit 1; }

PG_USER="$(docker exec "$PG_CONTAINER" printenv POSTGRES_USER)"
PG_DB="$(docker exec "$PG_CONTAINER" printenv POSTGRES_DB)"

echo "⚠️  ACHTUNG: Der aktuelle Inhalt von '${PG_DB}' wird durch '${FILE}' ERSETZT."
echo "   Container: ${PG_CONTAINER}"
if [ "${FORCE:-0}" != "1" ]; then
  read -r -p "   Wirklich fortfahren? (tippe: ja) " ANSWER
  [ "$ANSWER" = "ja" ] || { echo "Abgebrochen."; exit 1; }
fi

# Entschlüsseln falls nötig, dann einspielen. Der Dump enthält --clean
# --if-exists, räumt also selbst auf.
if [[ "$FILE" == *.gpg ]]; then
  [ -n "${BACKUP_PASSPHRASE:-}" ] || { echo "BACKUP_PASSPHRASE nötig für verschlüsselten Dump" >&2; exit 1; }
  gpg --batch --yes --quiet --passphrase "$BACKUP_PASSPHRASE" -d "$FILE" \
    | gunzip | docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -v ON_ERROR_STOP=1
else
  gunzip -c "$FILE" | docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -v ON_ERROR_STOP=1
fi

echo "✓ Restore abgeschlossen. Kurzprüfung:"
docker exec "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -c \
  "SELECT (SELECT count(*) FROM \"user\") AS nutzer, (SELECT count(*) FROM user_progress) AS fortschritte;"
