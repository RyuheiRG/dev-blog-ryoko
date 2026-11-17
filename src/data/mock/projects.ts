import type { Project } from "@/data/schemas";
import { secureupMedia, vacaCubicaMedia } from "./media";

import frameDataBayesMd from "./projects/frame-data-bayes.md?raw";
import secureupMd from "./projects/secureup.md?raw";
import vacaCubicaMd from "./projects/vaca-cubica.md?raw";

export const mockProjects: Project[] = [
  {
    id: "c1d2e3f4-1111-4222-8333-444455556666",
    slug: "frame-data-bayes",
    title: "Frame-Data-Bayes",
    summary:
      "Motor de análisis probabilístico y clasificación estadística que trata cada CSV como un entorno hostil.",
    cover: null,
    stack: ["Python", "Pandas", "Scikit-Learn", "Streamlit", "Bayes"],
    year: 2026,
    updated_at: "2026-11-15T10:00:00Z",
    publish_status: "published",
    lifecycle_status: "live",
    featured: true,
    repo_url: "https://github.com/RyuheiRG/frame-data-bayes",
    demo_url: null,
    sort_order: 1,
    seo: {
      title: "Frame-Data-Bayes — Case study",
      description:
        "Validación de datos, detección de tipos e inferencia bayesiana para analizar CSV hostiles sin inventar métricas.",
      og_image: null,
      canonical_url: null,
      noindex: false,
    },
    case_study_md: frameDataBayesMd,
    gallery: [],
    github: null,
    role: "Desarrollo, datos, UI",
    team: ["Individual"],
    learnings: [
      "Validar antes de modelar ahorra horas de debugging.",
      "La interpretabilidad importa más que la accuracy en un contexto académico.",
      "Un pipeline claro se puede explicar; un notebook no.",
    ],
  },
  {
    id: "c1d2e3f4-2222-4222-8333-444455556666",
    slug: "secureup",
    title: "SecureUP",
    summary:
      "App Android de seguridad digital personal: verifica contraseñas filtradas sin enviarlas y analiza QR en local.",
    cover: secureupMedia,
    stack: ["Kotlin", "Jetpack Compose", "Room", "HIBP", "MVVM"],
    year: 2026,
    updated_at: "2026-11-15T10:00:00Z",
    publish_status: "published",
    lifecycle_status: "wip",
    featured: true,
    repo_url: "https://github.com/RyuheiRG/SecureUP/tree/develop",
    demo_url: null,
    sort_order: 2,
    seo: {
      title: "SecureUP — Case study",
      description:
        "k-anonimato con HIBP, análisis local de URLs y Room: una app de seguridad que no recolecta credenciales.",
      og_image: null,
      canonical_url: null,
      noindex: false,
    },
    case_study_md: secureupMd,
    gallery: [
      {
        ...secureupMedia,
        alt: "Pantalla de inicio de SecureUP mostrando el Security Score y los accesos rápidos",
      },
    ],
    github: null,
    role: "Desarrollo Android",
    team: ["Individual"],
    learnings: [
      "El k-anonimato es una decisión de diseño, no solo de criptografía.",
      "El historial local puede dar valor sin backend.",
      "La seguridad de una app también está en lo que no hace.",
    ],
  },
  {
    id: "c1d2e3f4-3333-4222-8333-444455556666",
    slug: "vaca-cubica",
    title: "Vaca Cúbica",
    summary:
      "Sistema de Gestión Bovina con monorepositorio React + FastAPI y despliegue en AWS con RDS privado.",
    cover: vacaCubicaMedia,
    stack: ["React", "Vite", "FastAPI", "MySQL", "AWS"],
    year: 2026,
    updated_at: "2026-11-15T10:00:00Z",
    publish_status: "published",
    lifecycle_status: "live",
    featured: true,
    repo_url: "https://github.com/RyuheiRG/vaca-cubica",
    demo_url: "https://vaca-cubica.vercel.app",
    sort_order: 3,
    seo: {
      title: "Vaca Cúbica — Case study",
      description:
        "Monorepo React + FastAPI, MySQL en Amazon RDS y despliegue en AWS con una VPC privada.",
      og_image: null,
      canonical_url: null,
      noindex: false,
    },
    case_study_md: vacaCubicaMd,
    gallery: [
      {
        ...vacaCubicaMedia,
        alt: "Pantalla de inicio de sesión de Vaca Cúbica con un ternero y el formulario de acceso",
      },
    ],
    github: null,
    role: "Full stack",
    team: ["Ricardo Reyes Gómez", "Erick de Jesús Nafate Nafate", "Braulio Alejandro Jiménez"],
    learnings: [
      "La separación cliente-servidor se vuelve tangible cuando hay que desplegar.",
      "La seguridad de infraestructura no es opcional: RDS privado, security groups y secrets.",
      "Un monorepo ordena el trabajo en equipo, pero exige disciplina.",
    ],
  },
];
