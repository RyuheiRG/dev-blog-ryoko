import type { Author, Media } from "@/data/schemas";

const CREATED_AT = "2026-11-15T18:00:00Z";

export const portraitMedia: Media = {
  id: "7d1a4c2e-8f3b-4a5d-9c6e-1b2a3c4d5e6f",
  url: "https://media.ryuheirg.dev/mock/portrait.jpeg",
  width: 972,
  height: 1296,
  mime_type: "image/jpeg",
  size_bytes: 116324,
  alt: "Retrato de Ricardo Reyes Gómez con suéter negro",
  blurhash: null,
  created_at: CREATED_AT,
};

export const secureupMedia: Media = {
  id: "9b2c5d3f-1a4e-4f6b-8c7d-2e3f4a5b6c7d",
  url: "https://media.ryuheirg.dev/mock/secureup.png",
  width: 1080,
  height: 2400,
  mime_type: "image/png",
  size_bytes: 132804,
  alt: "Pantalla de inicio de SecureUP con Security Score de 70 sobre 100",
  blurhash: null,
  created_at: CREATED_AT,
};

export const vacaCubicaMedia: Media = {
  id: "5e3f7a1b-2c4d-4e5f-9a6b-3c4d5e6f7a8b",
  url: "https://media.ryuheirg.dev/mock/vaca-cubica.png",
  width: 1918,
  height: 825,
  mime_type: "image/png",
  size_bytes: 973540,
  alt: "Pantalla de inicio de sesión de Vaca Cúbica con un ternero comiendo pasto",
  blurhash: null,
  created_at: CREATED_AT,
};

export const author: Author = {
  id: "1f2e3d4c-5b6a-4978-8e7d-6c5b4a3f2e1d",
  name: "Ricardo Reyes Gómez",
  alias: "Ryoko",
  avatar: portraitMedia,
  bio: "Estudiante de ITID en UPChiapas. Full stack con enfoque en seguridad.",
  github_url: "https://github.com/RyuheiRG",
  linkedin_url: "https://www.linkedin.com/in/ryuhei-rg/",
};
