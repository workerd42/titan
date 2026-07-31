/**
 * build-info.ts — EINE Quelle für Build-Identität (Version, Phase, Commit,
 * Umgebung, Build-Zeit). Verhindert, dass der Phase-/Versionsstatus an mehreren
 * Stellen hardcodiert wird und veraltet (Auslöser 2026-07-23: Status stand
 * fälschlich noch auf „Phase 1"). Siehe docs/planung/roadmap.md 2.1.
 *
 * Werte werden zur BUILD-Zeit eingefroren (statischer Export):
 * - `version` + `phase` kommen aus dem Repo (package.json + Konstante hier).
 * - `commit` + `env` werden vom Deploy (deploy.sh → Docker-Build-Arg → Env)
 *   injiziert; ohne Injektion greifen graceful die Fallbacks „dev" / „local".
 */
import pkg from '../../package.json';

/** Einzige Quelle des Phase-/Reifegrad-Status — nur hier ändern. */
export const PHASE = 'Phase 2 · Beta';

/** Kurzer, robuster Zugriff auf Build-Env-Variablen (Node-Build-Zeit). */
function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== '' ? v.trim() : undefined;
}

const commitFull = env('COMMIT_SHA') ?? env('GIT_COMMIT') ?? env('SOURCE_COMMIT');

/** „staging" | „prod" | „local": explizites DEPLOY_ENV gewinnt, sonst aus NODE_ENV abgeleitet. */
function resolveEnv(): string {
  const explicit = env('DEPLOY_ENV');
  if (explicit) return explicit;
  return env('NODE_ENV') === 'production' ? 'prod' : 'local';
}

export const BUILD_INFO = {
  version: pkg.version as string,
  phase: PHASE,
  /** 7-stelliger Short-SHA oder „dev", wenn kein Deploy-Kontext gesetzt ist. */
  commit: commitFull ? commitFull.slice(0, 7) : 'dev',
  env: resolveEnv(),
  /** Zeitpunkt des Builds (eingefroren beim statischen Export). */
  builtAt: new Date(),
} as const;
