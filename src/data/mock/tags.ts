import type { Tag } from "@/data/schemas";

export const mockTags: Tag[] = [
  {
    id: "a1b2c3d4-0001-4001-8001-000000000001",
    slug: "astro",
    name: "Astro",
    description: "Sitios estáticos, islas y build time.",
    post_count: 1,
  },
  {
    id: "a1b2c3d4-0001-4001-8001-000000000002",
    slug: "fastapi",
    name: "FastAPI",
    description: "APIs en Python con tipos y documentación.",
    post_count: 1,
  },
  {
    id: "a1b2c3d4-0001-4001-8001-000000000003",
    slug: "arquitectura",
    name: "Arquitectura",
    description: "Decisiones, tradeoffs y sistemas que se entienden.",
    post_count: 1,
  },
  {
    id: "a1b2c3d4-0001-4001-8001-000000000004",
    slug: "cms",
    name: "CMS",
    description: "Contenido propio, sin dependencias innecesarias.",
    post_count: 1,
  },
  {
    id: "a1b2c3d4-0001-4001-8001-000000000005",
    slug: "python",
    name: "Python",
    description: "Datos, scripts y backend.",
    post_count: 1,
  },
  {
    id: "a1b2c3d4-0001-4001-8001-000000000006",
    slug: "datos",
    name: "Datos",
    description: "Ingesta, validación y análisis.",
    post_count: 1,
  },
  {
    id: "a1b2c3d4-0001-4001-8001-000000000007",
    slug: "bayes",
    name: "Bayes",
    description: "Inferencia probabilística aplicada.",
    post_count: 1,
  },
  {
    id: "a1b2c3d4-0001-4001-8001-000000000008",
    slug: "seguridad",
    name: "Seguridad",
    description: "Zero Trust, validación y superficie de ataque.",
    post_count: 2,
  },
  {
    id: "a1b2c3d4-0001-4001-8001-000000000009",
    slug: "kotlin",
    name: "Kotlin",
    description: "Android con Jetpack Compose.",
    post_count: 1,
  },
  {
    id: "a1b2c3d4-0001-4001-8001-000000000010",
    slug: "android",
    name: "Android",
    description: "Apps móviles y seguridad local.",
    post_count: 1,
  },
  {
    id: "a1b2c3d4-0001-4001-8001-000000000011",
    slug: "hibp",
    name: "HIBP",
    description: "Contraseñas filtradas sin exponerlas.",
    post_count: 1,
  },
  {
    id: "a1b2c3d4-0001-4001-8001-000000000012",
    slug: "frontend",
    name: "Frontend",
    description: "Interfaces, accesibilidad y rendimiento.",
    post_count: 0,
  },
  {
    id: "a1b2c3d4-0001-4001-8001-000000000013",
    slug: "backend",
    name: "Backend",
    description: "APIs, bases de datos e infraestructura.",
    post_count: 0,
  },
];

export function tagsBySlug(slugs: string[]): Tag[] {
  return slugs
    .map((slug) => mockTags.find((tag) => tag.slug === slug))
    .filter((tag): tag is Tag => Boolean(tag));
}
