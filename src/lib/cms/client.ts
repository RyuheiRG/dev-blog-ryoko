import { isEnvFlagEnabled } from "@/lib/env";

export class CmsError extends Error {
  status: number;
  detail?: unknown;

  constructor(message: string, status: number, detail?: unknown) {
    super(message);
    this.name = "CmsError";
    this.status = status;
    this.detail = detail;
  }
}

type FetchOptions = {
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  token?: string;
  signal?: AbortSignal;
};

const TIMEOUT_MS = 10_000;
const RETRIES = 2;

let warnedAboutMocksInProduction = false;

function isMockMode(): boolean {
  const enabled = isEnvFlagEnabled(import.meta.env.CMS_USE_MOCKS);

  // Excepción temporal mientras el CMS no está desplegado. Cuando la Content
  // API esté disponible, configurar CMS_API_URL, CMS_API_TOKEN y
  // CMS_USE_MOCKS=false en Vercel.
  if (enabled && import.meta.env.VERCEL_ENV === "production" && !warnedAboutMocksInProduction) {
    warnedAboutMocksInProduction = true;
    console.warn(
      "[ryoko] CMS_USE_MOCKS=true en producción: el sitio se genera con contenido mock. " +
        "Configura CMS_API_URL, CMS_API_TOKEN y CMS_USE_MOCKS=false cuando el CMS esté disponible.",
    );
  }

  return enabled;
}

export async function cmsFetch<T>({ path, query, token, signal }: FetchOptions): Promise<T> {
  const base = import.meta.env.CMS_API_URL;
  if (!base) {
    throw new CmsError("CMS_API_URL no está definida.", 500);
  }

  const url = new URL(path, base);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const authToken = token ?? import.meta.env.CMS_API_TOKEN;
  let lastError: unknown;

  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        signal: signal ?? AbortSignal.timeout(TIMEOUT_MS),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        if (response.status >= 500 && attempt < RETRIES) {
          lastError = new CmsError(`CMS respondió ${response.status}`, response.status, detail);
          await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
          continue;
        }
        throw new CmsError(`CMS respondió ${response.status} en ${path}`, response.status, detail);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof CmsError) {
        throw error;
      }
      lastError = error;
      if (attempt === RETRIES) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }

  throw new CmsError(`No se pudo conectar con el CMS en ${path}`, 503, lastError);
}

export { isMockMode };
