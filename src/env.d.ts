/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly CMS_API_URL?: string;
  readonly CMS_API_TOKEN?: string;
  readonly CMS_PREVIEW_TOKEN?: string;
  readonly CMS_USE_MOCKS?: string;
  readonly METRICS_API_URL?: string;
  readonly METRICS_SITE_KEY?: string;
  readonly METRICS_DEBUG?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly GITHUB_TOKEN?: string;
  readonly VERCEL_ENV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.md?raw" {
  const content: string;
  export default content;
}
