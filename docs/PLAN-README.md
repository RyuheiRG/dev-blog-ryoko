# Ryoko / RyuheiRG — Documentación de planificación

> Documentación maestra para construir el sitio personal, el blog y las tres APIs del CMS.
> Estado: **frontend implementado contra mocks; CMS y panel de administración pendientes**.

## Qué es este proyecto

Un solo sitio personal para **Ricardo Reyes Gómez (Ryoko / RyuheiRG)** que reemplaza al portafolio actual `TemporalPortfolioWeb`.

Incluye:

- Landing profesional con hero cinematográfico.
- Blog técnico en español.
- Portafolio de proyectos con case studies.
- Página "Sobre mí".
- Contenido administrado por un CMS propio construido con tres APIs FastAPI.
- Métricas de visitas y clicks en una API GraphQL.

## Decisiones cerradas

| Tema | Decisión |
|---|---|
| Marca visible | **Ryoko** |
| Nombre legal | Ricardo Reyes Gómez |
| GitHub | `RyuheiRG` |
| Dominio | `ryuheirg.dev` |
| Deploy del frontend | Vercel, sitio estático |
| Framework | Astro 5 + TypeScript estricto |
| Estilos | Tailwind CSS 4 + design tokens propios |
| Animación | Motion One / GSAP ScrollTrigger solo en el hero |
| Contenido | Markdown (CommonMark + GFM) |
| CMS | 3 APIs FastAPI: Content, Webhook, Metrics (GraphQL) |
| Base de datos | PostgreSQL 16 |
| Automatización | n8n + Vercel Deploy Hook |
| Idioma | Español (`es-MX`) |
| Tema | Oscuro editorial, negro + carmesí + rojo |
| Tipografía | Instrument Serif + Inter + JetBrains Mono |
| v1 sin | ads, comentarios, newsletter, búsqueda, i18n, Three.js |

## Documentos

| Archivo | Para qué sirve | Quién lo usa |
|---|---|---|
| [PRODUCT.md](./PRODUCT.md) | Visión, alcance, mapa del sitio, métricas de éxito, migración | Todos |
| [API-CONTRACT.md](./API-CONTRACT.md) | Contrato detallado de las 3 APIs, schemas, auth, eventos, GraphQL | Agente del CMS + agente del frontend |
| [DESIGN.md](./DESIGN.md) | Identidad visual, tokens, tipografía, hero, componentes, accesibilidad | Agente del frontend |
| [FRONTEND-ARCHITECTURE.md](./FRONTEND-ARCHITECTURE.md) | Arquitectura Astro, capa de datos, SEO, build, deploy | Agente del frontend |
| [CONTENT.md](./CONTENT.md) | Voz, copy inicial, case studies, posts, assets | Todos |
| [AGENTS.md](./AGENTS.md) | Reglas de trabajo para agentes de IA, comandos, convenciones | Agentes de implementación |
| [ROADMAP.md](./ROADMAP.md) | Fases, tareas, criterios de aceptación, backlog | Todos |

## Cómo usar estos documentos

### Si vas a construir el CMS (las 3 APIs)

Lee en este orden:

1. `PRODUCT.md`
2. `API-CONTRACT.md`
3. `CONTENT.md` (para entender el modelo editorial)
4. `AGENTS.md`

El contrato es la fuente de verdad. Si algo no está definido, pregunta antes de inventarlo.

### Si vas a construir el frontend

Lee en este orden:

1. `PRODUCT.md`
2. `DESIGN.md`
3. `FRONTEND-ARCHITECTURE.md`
4. `API-CONTRACT.md` (solo las partes públicas y de métricas)
5. `CONTENT.md`
6. `AGENTS.md`

### Al iniciar la implementación

Copiar los documentos al repositorio:

```text
repo/
├── AGENTS.md                  ← copiar AGENTS.md aquí
├── docs/
│   ├── PRODUCT.md
│   ├── API-CONTRACT.md
│   ├── DESIGN.md
│   ├── FRONTEND-ARCHITECTURE.md
│   ├── CONTENT.md
│   └── ROADMAP.md
├── src/
└── ...
```

## Repositorios propuestos

| Repo | Contenido |
|---|---|
| `dev-blog-ryoko` | Frontend Astro + docs del sitio |
| `ryoko-platform` | Monorepo del CMS: `services/content-api`, `services/webhook-api`, `services/metrics-api`, `apps/admin`, `packages/common`, `infra/` |

Si se prefiere, el CMS puede vivir en tres repos separados. La recomendación es un monorepo para compartir configuración, auth, errores y modelos. El panel de administración vive en `apps/admin` y es un cuarto entregable, separado de las tres APIs.

## Orden recomendado

1. Cerrar y comprar el dominio.
2. Construir el frontend contra mocks (no esperar al CMS).
3. Definir y construir la Content API.
4. Construir la Webhook API + n8n + deploy hook.
5. Construir la Metrics API GraphQL.
6. Construir el panel de administración en `apps/admin`.
7. Integrar, migrar contenido y lanzar.

## Advertencias

- **No usar arte oficial de Chainsaw Man** en el sitio público. Las imágenes son moodboard. El arte final debe ser original: foto propia, cuervos y marcas rojas.
- **No agregar Three.js en v1.** El hero se resuelve con capas 2D, scroll sticky y una librería ligera.
- **No agregar ads, comentarios, newsletter ni búsqueda en v1.**
- **No exponer tokens de administración en el frontend.**
- **No hacer que el blog dependa de la API en tiempo de ejecución.** El contenido se consume en build; las métricas son lo único que se envía desde el navegador.
