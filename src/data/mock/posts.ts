import type { Post } from "@/data/schemas";
import { author } from "./media";
import { tagsBySlug } from "./tags";

import comoConstruiMd from "./posts/como-construi-ryoko.md?raw";
import zeroTrustMd from "./posts/zero-trust-aplicado-a-datos.md?raw";
import secureupMd from "./posts/secureup-verificar-contrasenas-sin-enviarlas.md?raw";

export const mockPosts: Post[] = [
  {
    id: "d4e5f6a7-1111-4222-8333-444455556666",
    slug: "como-construi-ryoko",
    title: "Cómo construí Ryoko: Astro, FastAPI y un CMS propio",
    excerpt:
      "Astro, FastAPI y un CMS propio para publicar sin fricción: el razonamiento detrás de Ryoko y su pipeline de build.",
    cover: null,
    tags: tagsBySlug(["astro", "fastapi", "arquitectura", "cms"]),
    published_at: "2026-11-15T10:00:00Z",
    updated_at: "2026-11-15T10:00:00Z",
    reading_time_minutes: 8,
    featured: true,
    publish_status: "published",
    type: "article",
    seo: {
      title: "Cómo construí Ryoko: Astro, FastAPI y un CMS propio",
      description:
        "Un blog estático con CMS propio: Astro en build time, tres APIs FastAPI y un deploy que se dispara solo.",
      og_image: null,
      canonical_url: null,
      noindex: false,
    },
    content_md: comoConstruiMd,
    author,
  },
  {
    id: "d4e5f6a7-2222-4222-8333-444455556666",
    slug: "zero-trust-aplicado-a-datos",
    title: "Zero Trust aplicado a datos: Frame-Data-Bayes",
    excerpt:
      "Un CSV es una superficie de ataque: validación, detección de tipos e inferencia bayesiana en Frame-Data-Bayes.",
    cover: null,
    tags: tagsBySlug(["python", "datos", "bayes", "seguridad"]),
    published_at: "2026-11-08T10:00:00Z",
    updated_at: "2026-11-08T10:00:00Z",
    reading_time_minutes: 7,
    featured: false,
    publish_status: "published",
    type: "article",
    seo: {
      title: "Zero Trust aplicado a datos: Frame-Data-Bayes",
      description:
        "Validar antes de modelar: pipeline de ingesta, detección de tipos e inferencia bayesiana para datos hostiles.",
      og_image: null,
      canonical_url: null,
      noindex: false,
    },
    content_md: zeroTrustMd,
    author,
  },
  {
    id: "d4e5f6a7-3333-4222-8333-444455556666",
    slug: "secureup-verificar-contrasenas-sin-enviarlas",
    title: "SecureUP: cómo verificar contraseñas sin enviarlas",
    excerpt:
      "Cómo verificar contraseñas filtradas sin enviarlas, analizar QR en local y guardar el historial en el dispositivo.",
    cover: null,
    tags: tagsBySlug(["kotlin", "android", "seguridad", "hibp"]),
    published_at: "2026-11-01T10:00:00Z",
    updated_at: "2026-11-01T10:00:00Z",
    reading_time_minutes: 9,
    featured: false,
    publish_status: "published",
    type: "article",
    seo: {
      title: "SecureUP: verificar contraseñas sin enviarlas",
      description:
        "k-anonimato, SHA-1 y análisis local de URLs: cómo construir una app de seguridad que no recolecta secretos.",
      og_image: null,
      canonical_url: null,
      noindex: false,
    },
    content_md: secureupMd,
    author,
  },
];
