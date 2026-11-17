import type { Landing } from "@/data/schemas";
import { portraitMedia } from "./media";

export const mockLanding: Landing = {
  hero: {
    eyebrow: "Ricardo Reyes Gómez / Full Stack + Security",
    title: "Ricardo Reyes Gómez",
    alias: "Ryoko",
    statement: "Desarrollador full stack. Estudiante. Zero Trust.",
    primary_cta: { label: "Ver proyectos", href: "/proyectos" },
    secondary_cta: { label: "Leer el blog", href: "/blog" },
    portrait: portraitMedia,
  },
  about: {
    title: "Sobre mí",
    body_md:
      "Soy Ricardo Reyes Gómez, estudiante de Ingeniería en Tecnologías de la Información e Innovación Digital en la Universidad Politécnica de Chiapas.\n\nConstruyo software full stack con enfoque en seguridad y arquitectura Zero Trust. Me gusta entender cómo funcionan las cosas por dentro, documentar las decisiones y dejar sistemas que otra persona pueda mantener.",
    photo: portraitMedia,
    highlights: ["Full stack", "Security first", "Clean code"],
    facts: [
      { label: "Universidad", value: "UPChiapas" },
      { label: "Carrera", value: "ITID" },
      { label: "Semestre", value: "4.º cuatrimestre" },
      { label: "Ubicación", value: "Chiapas, México" },
    ],
    timeline: [
      {
        year: 2025,
        title: "Inicio de la carrera en UPChiapas",
        description: "Primer contacto con desarrollo web, redes y sistemas operativos.",
      },
      {
        year: 2026,
        title: "Frame-Data-Bayes, SecureUP y Vaca Cúbica",
        description: "Tres proyectos con datos, seguridad móvil y despliegue en AWS.",
      },
      {
        year: 2026,
        title: "Certificaciones Cisco y AWS Academy",
        description: "Fundamentos de redes, sistemas operativos y nube.",
      },
      {
        year: 2026,
        title: "Ryoko / portafolio y blog",
        description: "Este sitio: Astro, FastAPI y un CMS propio.",
      },
    ],
  },
  stack: [
    {
      category: "Lenguajes",
      items: [
        { name: "TypeScript", icon: "typescript" },
        { name: "JavaScript", icon: "javascript" },
        { name: "Python", icon: "python" },
        { name: "Kotlin", icon: null },
        { name: "C++", icon: "cpp" },
        { name: "SQL", icon: "mysql" },
      ],
    },
    {
      category: "Frontend",
      items: [
        { name: "React", icon: "react" },
        { name: "Astro", icon: "astro" },
        { name: "Vite", icon: "vite" },
        { name: "Tailwind CSS", icon: "tailwind" },
        { name: "HTML5", icon: "html5" },
        { name: "CSS3", icon: "css3" },
      ],
    },
    {
      category: "Backend y datos",
      items: [
        { name: "Node.js", icon: "node" },
        { name: "Express", icon: "express" },
        { name: "FastAPI", icon: null },
        { name: "MySQL", icon: "mysql" },
        { name: "PostgreSQL", icon: null },
        { name: "Redis", icon: "redis" },
      ],
    },
    {
      category: "Seguridad y DevOps",
      items: [
        { name: "Docker", icon: "docker" },
        { name: "Nginx", icon: "nginx" },
        { name: "Git", icon: "git" },
        { name: "Linux", icon: "linux" },
        { name: "Ubuntu", icon: "ubuntu" },
        { name: "Postman", icon: "postman" },
      ],
    },
    {
      category: "Herramientas",
      items: [
        { name: "Jest", icon: "jest" },
        { name: "VS Code", icon: "vscode" },
        { name: "Vercel", icon: "vercel" },
        { name: "Figma", icon: "figma" },
      ],
    },
  ],
  certifications: [
    {
      title: "Operating Systems Support",
      issuer: "Cisco",
      date: "2026-03-23",
      url: null,
    },
    {
      title: "Operating Systems Basics",
      issuer: "Cisco",
      date: "2026-02-13",
      url: null,
    },
    {
      title: "AWS Academy Graduate - Cloud Foundations",
      issuer: "AWS Academy",
      date: "2025-11-21",
      url: null,
    },
    {
      title: "Introduction to IoT",
      issuer: "Cisco",
      date: "2025-11-19",
      url: null,
    },
    {
      title: "Networking Basics",
      issuer: "Cisco",
      date: "2025-10-26",
      url: null,
    },
  ],
  contact: {
    title: "Hablemos",
    body: "¿Tienes una idea, una pregunta o una oportunidad? Escríbeme.",
    email: "hola@ryuheirg.dev",
    links: [
      { label: "GitHub", url: "https://github.com/RyuheiRG", icon: "github" },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/ryuhei-rg/",
        icon: "linkedin",
      },
    ],
  },
};
