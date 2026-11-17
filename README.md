# Ryoko

Sitio personal de **Ricardo Reyes Gómez (Ryoko / RyuheiRG)**: landing, bitácora y portafolio.
Frontend estático en Astro que hoy consume mocks con la misma forma que la Content API de FastAPI.

- Sitio objetivo: `https://ryuheirg.dev` (dominio aún no comprado).
- Idioma: español `es-MX`.
- Tema: oscuro editorial, negro + carmesí + rojo.
- Deploy: Vercel, salida estática.

La documentación de producto, diseño, contrato y arquitectura vive en [`docs/`](./docs) y las reglas de trabajo en [`AGENTS.md`](./AGENTS.md).

## Stack

- Astro 5 + TypeScript estricto.
- Tailwind CSS 4 con tokens propios en `src/styles/global.css`.
- Zod para validar todo lo que llega del CMS.
- Markdown con unified/remark/rehype, sanitize y Shiki.
- Fuentes locales: Instrument Serif, Inter Variable y JetBrains Mono Variable.
- OG images generadas en build como PNG con `sharp`.

> TypeScript está fijado en 6.x porque `astro check` todavía no funciona con el compilador nativo de TypeScript 7.

## Requisitos

- Node.js 22 o superior.
- pnpm 10 o superior.

## Comandos

| Comando               | Qué hace                                                         |
| --------------------- | ---------------------------------------------------------------- |
| `pnpm install`        | Instala dependencias.                                            |
| `pnpm dev`            | Servidor de desarrollo en `http://localhost:4321`.               |
| `pnpm build`          | Build estático en `dist/`, con OG images e imágenes optimizadas. |
| `pnpm preview`        | Sirve el build local.                                            |
| `pnpm check`          | `astro check`: tipos y diagnósticos de Astro/TS.                 |
| `pnpm test`           | Tests unitarios con Vitest.                                      |
| `pnpm validate:mocks` | Valida los mocks contra los schemas Zod.                         |
| `pnpm format`         | Formatea con Prettier.                                           |
| `pnpm format:check`   | Verifica formato sin escribir.                                   |

## Variables de entorno

Copia `.env.example` a `.env` para desarrollo local.

| Variable            | Uso                                                                 |
| ------------------- | ------------------------------------------------------------------- |
| `PUBLIC_SITE_URL`   | URL canónica del sitio. Default: `https://ryuheirg.dev`.            |
| `CMS_USE_MOCKS`     | `true` usa `src/data/mock/*` sin llamar a la API.                   |
| `CMS_API_URL`       | Base de la Content API cuando los mocks están apagados.             |
| `CMS_API_TOKEN`     | Token público de lectura para el build. Nunca se expone al cliente. |
| `CMS_PREVIEW_TOKEN` | Token opcional para builds de preview con drafts.                   |
| `METRICS_API_URL`   | Endpoint de métricas. Si está vacío, no se envía analítica.         |
| `METRICS_SITE_KEY`  | Clave pública del sitio para métricas. No permite leer datos.       |
| `METRICS_DEBUG`     | `true` imprime eventos de métricas en consola.                      |
| `GITHUB_TOKEN`      | Token opcional para el script de datos de GitHub.                   |

En Vercel, `CMS_USE_MOCKS=true` está bloqueado cuando `VERCEL_ENV=production`: el build falla en lugar de publicar contenido de ejemplo.

## Contenido y placeholders

- Los mocks viven en `src/data/mock/`; los textos largos, en `src/data/mock/posts/` y `src/data/mock/projects/`.
- Frame-Data-Bayes todavía no tiene capturas. Su portada es tipográfica y muestra el aviso **Sin imagen todavía**.
- El correo público es un placeholder: `hola@ryuheirg.dev`.
- El dominio es configurable con `PUBLIC_SITE_URL`; no está comprado.
- Las imágenes locales se mapean por UUID en `src/lib/images.ts`. Si cambias un ID de media, actualiza ese mapa para no perder la optimización de Astro.

## Estructura

```text
src/
├── components/   # UI, layout, blog, proyectos, hero
├── data/         # schemas Zod y mocks
├── layouts/      # BaseLayout
├── lib/          # CMS, markdown, SEO, JSON-LD, fechas, media
├── pages/        # rutas Astro
├── scripts/      # analítica y comportamiento del UI
└── styles/       # tokens, global, prose
tests/            # Vitest
docs/             # producto, diseño, contrato, arquitectura
```

## Rutas principales

| Ruta                | Contenido                                 |
| ------------------- | ----------------------------------------- |
| `/`                 | Landing con hero de 3 etapas.             |
| `/blog`             | Índice de la bitácora.                    |
| `/blog/[slug]`      | Post con TOC, related posts y navegación. |
| `/proyectos`        | Índice de proyectos.                      |
| `/proyectos/[slug]` | Case study con ficha y galería.           |
| `/etiquetas`        | Índice de etiquetas.                      |
| `/sobre-mi`         | Biografía, stack, trayectoria y contacto. |
| `/privacidad`       | Política de privacidad.                   |
| `/rss.xml`          | Feed RSS.                                 |
| `/robots.txt`       | Reglas para crawlers.                     |
| `/og/[...slug].png` | OG images generadas en build.             |

## Deploy

1. Conecta el repo a Vercel.
2. Build command: `pnpm build`.
3. Output directory: `dist`.
4. Define `PUBLIC_SITE_URL` y, cuando exista, `CMS_API_URL` + `CMS_API_TOKEN`.
5. Deja `CMS_USE_MOCKS` sin definir (o en `false`) para producción.

## Estado

Implementación del frontend contra mocks terminada. Pendientes: las tres APIs del CMS, el panel de administración en `cms.ryuheirg.dev`, dominio, correo definitivo, capturas de Frame-Data-Bayes y retrato en mayor resolución.
