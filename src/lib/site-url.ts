const DEFAULT_APP_URL = "https://axto.dev";

/**
 * Canonical public site URL. Robust against `NEXT_PUBLIC_APP_URL` being
 * unset *or set to an empty string* — the latter happens in CI when the
 * repo variable isn't configured, and would otherwise make
 * `new URL(process.env.NEXT_PUBLIC_APP_URL ?? default)` throw
 * `ERR_INVALID_URL` (since `??` only falls back on null/undefined, not
 * `""`), breaking the production build.
 */
export function getAppUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return raw ? raw.replace(/\/$/, "") : DEFAULT_APP_URL;
}
