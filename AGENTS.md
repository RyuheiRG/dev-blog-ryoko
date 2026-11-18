# AGENTS.md — Reglas para agentes de IA

> Este archivo es el punto de entrada para cualquier agente que trabaje en Ryoko.
> Léelo completo antes de tocar código.

## 1. Contexto del proyecto

Ryoko es el sitio personal de **Ricardo Reyes Gómez (Ryoko / RyuheiRG)**: landing, blog y portafolio. El contenido se administra desde un CMS propio con tres APIs FastAPI. El frontend es Astro estático desplegado en Vercel.

- Dominio: `https://ryuheirg.dev`
- Repo frontend: `dev-blog-ryoko`
- Repo CMS: `ryoko-platform` (monorepo propuesto)
- Idioma del producto: español (`es-MX`)
- Tema: oscuro editorial, negro + carmesí + rojo
- Estado: planificación cerrada, implementación pendiente

## 2. Documentos que debes leer

| Documento | Cuándo |
|---|---|
| `docs/PRODUCT.md` | Siempre |
| `docs/API-CONTRACT.md` | Siempre que toques datos, endpoints o métricas |
| `docs/DESIGN.md` | Siempre que toques UI |
| `docs/FRONTEND-ARCHITECTURE.md` | Siempre que toques el frontend |
| `docs/CONTENT.md` | Siempre que escribas copy o contenido |
| `docs/ROADMAP.md` | Para saber qué toca y qué no |

Si un requisito no está en estos documentos, **pregunta antes de inventarlo**.

## 3. Estructura de repos

### Frontend (`dev-blog-ryoko`)

```text
src/
├── components/     # UI, layout, blog, projects, hero
├── data/           # mocks y cache de GitHub
├── layouts/        # Base, Blog, Project, Page
├── lib/            # CMS, markdown, SEO, analytics
├── pages/          # rutas Astro
├── styles/         # tokens, global, prose
└── env.d.ts
scripts/            # fetch-github, generate-og
tests/              # unit, e2e
docs/               # estos documentos
```

### CMS (`ryoko-platform`)

```text
services/
├── content-api/    # FastAPI REST: admin + public
├── webhook-api/    # FastAPI: eventos, HMAC, reintentos
└── metrics-api/    # FastAPI + Strawberry GraphQL
packages/
└── common/         # settings, auth, errors, logging, pagination
infra/              # Docker, compose, deploy
docs/               # contrato y decisiones
```

## 4. Comandos

> **Frontend: pnpm.** Es una decisión cerrada del proyecto; no usar npm ni yarn ni generar `package-lock.json` o `yarn.lock`. La versión está fijada en `package.json` con `packageManager`.
>
> **CMS: uv.** No usar `pip` global ni `python -m venv` manual. `uv sync` crea el `.venv` local y `uv run` ejecuta dentro de él. `ruff`, `mypy` y `pytest` son dependencias de desarrollo, no herramientas globales.

### Frontend

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm astro check
pnpm tsc --noEmit
pnpm lint
pnpm format
pnpm test
pnpm test:e2e
pnpm validate:mocks
pnpm fetch:github
pnpm download:media
```

### CMS

```bash
# Content API
cd services/content-api
uv sync
uv run uvicorn app.main:app --reload --port 8000
uv run pytest
uv run ruff check .
uv run mypy app

# Webhook API
cd services/webhook-api
uv sync
uv run uvicorn app.main:app --reload --port 8001
uv run pytest

# Metrics API
cd services/metrics-api
uv sync
uv run uvicorn app.main:app --reload --port 8002
uv run pytest

# Todo con Docker
docker compose up --build
```

Si el compose vive en `infra/`, ejecutar `docker compose -f infra/docker-compose.yml up --build`. Usar siempre Docker Compose v2 o superior.

Si un comando no existe todavía, créalo de forma consistente con los demás y actualiza este archivo.

## 5. Convenciones de código

### Frontend

- TypeScript estricto. No usar `any`.
- Usar pnpm para instalar dependencias y ejecutar scripts; no npm ni yarn.
- Astro components para todo lo estático; islas solo para interactividad real.
- Tailwind con tokens CSS; no colores arbitrarios (`text-[#ff0000]` prohibido).
- Nombres de componentes en PascalCase; archivos `.astro` con PascalCase.
- Imports absolutos con alias `@/`.
- Funciones puras en `src/lib`; componentes sin lógica de datos.
- No hacer `fetch` en componentes; usar `src/lib/cms/queries.ts`.
- Validar toda respuesta del CMS con Zod.
- Formatear fechas con `Intl.DateTimeFormat("es-MX")`.
- No usar `set:html` con contenido sin sanitizar.

### CMS

- Python 3.12+.
- Gestionar Python y dependencias con `uv`; no usar `pip` global.
- `uv python pin 3.12`, `uv sync` para el entorno local y `uv run` para ejecutar.
- `ruff`, `mypy` y `pytest` como dependencias de desarrollo; no instalarlas globalmente.
- Docker Compose v2 (`docker compose`); no usar `docker-compose` v1.
- FastAPI + Pydantic v2.
- SQLAlchemy 2.0 async + asyncpg.
- Alembic para migraciones.
- Ruff para lint/format; mypy para tipos.
- `snake_case` en Python y JSON.
- Errores RFC 7807.
- No lógica de negocio en routers; usar services.
- No queries SQL crudas sin justificación.
- Tests con pytest + httpx.

### Contrato

- JSON en `snake_case`.
- Fechas ISO 8601 UTC con `Z`.
- IDs UUID.
- Errores RFC 7807.
- Paginación `{ data, meta }`.
- Proyectos: `publish_status` (visibilidad) y `lifecycle_status` (`live`, `wip`, `archived`) son campos distintos; no mezclarlos.
- No cambiar campos existentes sin actualizar `API-CONTRACT.md` y los schemas Zod/Pydantic.
- Cambios incompatibles: nueva versión `/v2` o migración documentada.

## 6. Reglas de diseño

- Usar los tokens de `DESIGN.md`; no inventar colores.
- Un solo acento rojo. No azules, verdes ni morados en el chrome.
- Tipografía: Instrument Serif (display), Inter (texto), JetBrains Mono (metadata/código).
- Bordes de 1 px, radios ≤ 2 px, sin sombras difusas.
- Mucho espacio; no llenar el viewport.
- Un solo momento animado: el hero.
- No carruseles, popups, ads, ni animaciones en cada sección.
- No usar arte oficial de Chainsaw Man ni fan art sin permiso.
- Respetar `prefers-reduced-motion`.
- Todo interactivo debe tener foco visible.
- No usar emojis en la UI principal.

## 7. Reglas de contenido

- Español `es-MX`, tuteo, primera persona.
- Sin "apasionado", "disruptivo", "sinergia".
- Case studies con problema, restricciones, decisiones, resultado y aprendizajes.
- No inventar métricas ni testimonios.
- No pegar READMEs.
- No lorem ipsum al lanzar.
- Tags: 2–4 por post.
- Slugs en kebab-case, sin fechas.
- Imágenes con alt descriptivo.
- No secretos en ejemplos de código.

## 8. Reglas de seguridad

- Nunca commitear `.env`, tokens, claves ni credenciales.
- `CMS_API_TOKEN` y `CMS_PREVIEW_TOKEN` solo en el build; nunca en el cliente.
- `METRICS_SITE_KEY` es público, pero no permite leer datos.
- Sanitizar Markdown con `rehype-sanitize`.
- Validar MIME real en uploads.
- Limitar tamaño de archivos.
- CORS restringido.
- Rate limiting en login, público y métricas.
- No loggear PII ni bodies sensibles.
- No usar `eval`, `new Function` ni HTML crudo.

## 9. Testing y calidad

### Antes de abrir un PR

- [ ] `pnpm astro check` pasa.
- [ ] `pnpm tsc --noEmit` pasa.
- [ ] `pnpm lint` pasa.
- [ ] `pnpm test` pasa.
- [ ] `pnpm build` pasa.
- [ ] No hay errores de consola.
- [ ] Lighthouse ≥ 95 en las páginas tocadas.
- [ ] axe sin errores críticos.
- [ ] Responsive 360/768/1440.
- [ ] Teclado funciona.
- [ ] `prefers-reduced-motion` funciona.

### CMS

- [ ] `uv run pytest` pasa.
- [ ] `uv run ruff check .` pasa.
- [ ] `uv run mypy app` pasa.
- [ ] Migración Alembic incluida si hay cambios de DB.
- [ ] Tests de contrato actualizados.
- [ ] `API-CONTRACT.md` actualizado si cambió un schema.

## 10. Git y PRs

- Rama principal: `main`.
- Ramas: `feat/…`, `fix/…`, `docs/…`, `chore/…`.
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- PR pequeño y con contexto.
- No mezclar refactor con feature.
- No commitear archivos generados (`dist/`, `.astro/`, `node_modules/`).
- No hacer force push a `main`.
- No borrar ramas ajenas.

## 11. Comportamiento del agente

### Haz

- Lee los docs antes de proponer cambios.
- Inspecciona el código existente antes de reescribir.
- Mantén los cambios enfocados en la tarea.
- Reutiliza componentes y tokens existentes.
- Pregunta si el contrato es ambiguo.
- Actualiza la documentación cuando cambies una decisión.
- Ejecuta los checks antes de decir que terminaste.
- Deja el código más simple de lo que lo encontraste.

### No hagas

- No inventes endpoints, campos o estados.
- No cambies el diseño sin actualizar `DESIGN.md`.
- No agregues dependencias sin justificar peso y alternativa.
- No agregues Three.js, ads, comentarios, newsletter o búsqueda en v1.
- No uses arte con copyright.
- No expongas secretos.
- No hagas refactors masivos no solicitados.
- No borres archivos del usuario sin confirmar.
- No ejecutes comandos destructivos (`rm -rf`, `git reset --hard`) sin confirmar.

## 12. Definition of done

### Frontend

- La página funciona con mocks y con CMS real.
- Zod valida las respuestas.
- SEO completo.
- Responsive y accesible.
- Performance dentro de presupuesto.
- Sin errores de consola.
- Documentación actualizada.
- Deploy preview revisado.

### CMS

- Endpoint documentado en OpenAPI.
- Schema Pydantic coincide con el contrato.
- Tests de éxito y error.
- Auth y permisos probados.
- Rate limit probado.
- Migración incluida.
- Logs sin secretos.
- Health check.
- Documentación actualizada.

## 13. Troubleshooting

| Problema | Solución |
|---|---|
| El build falla por Zod | Revisar `API-CONTRACT.md` y el response real; no relajar el schema sin discutirlo |
| El hero no anima en Safari | Verificar `position: sticky`, `transform` y el fallback de reduced motion |
| Las imágenes remotas no optimizan | Usar el script de descarga a `src/assets/generated/` |
| Vercel no reconstruye | Revisar el Deploy Hook, el evento del webhook y los logs de n8n |
| CORS en métricas | Revisar `CORS_ORIGINS` y el origen exacto (sin slash final) |
| 401 en Content API | Verificar `CMS_API_TOKEN` y que sea token público, no admin |
| 403 en admin | Verificar rol del usuario |
| Duplicados en métricas | Verificar `event_id` único |

## 14. Contacto y ownership

- Dueño del proyecto: Ricardo Reyes Gómez (`RyuheiRG`).
- Repo frontend: `dev-blog-ryoko`.
- Repo CMS: `ryoko-platform`.
- Package manager frontend: `pnpm`; Python: `uv`.
- Documentación: `docs/`.
- Dudas de contrato: preguntar antes de implementar.

## 15. Principio final

> Si una decisión no está documentada, no es una decisión: es una suposición.
> Documenta, valida y deja el sistema más claro que antes.
