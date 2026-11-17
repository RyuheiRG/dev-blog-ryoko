/**
 * Astro inlinea los valores `true`, `false`, `0` y `1` que llegan por
 * `process.env` (por ejemplo, variables configuradas en Vercel) como
 * literales booleanos o numéricos. Los valores de un archivo `.env` sí
 * llegan como string. Esta función normaliza ambos casos.
 */
export function isEnvFlagEnabled(value: unknown): boolean {
  return value === true || value === 1 || value === "true" || value === "1";
}
