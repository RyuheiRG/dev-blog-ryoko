import type { SiteSettings } from "@/data/schemas";
import { author } from "./media";

const siteUrl = import.meta.env.PUBLIC_SITE_URL || "https://ryuheirg.dev";

export const mockSiteSettings: SiteSettings = {
  site_name: "Ryoko",
  tagline: "Full Stack + Security",
  description:
    "Sitio personal de Ricardo Reyes Gómez (Ryoko): proyectos full stack, seguridad y notas técnicas.",
  url: siteUrl,
  locale: "es-MX",
  author,
  socials: [
    { label: "GitHub", url: "https://github.com/RyuheiRG", icon: "github" },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/ryuhei-rg/",
      icon: "linkedin",
    },
    { label: "RSS", url: "/rss.xml", icon: "rss" },
    { label: "Email", url: "mailto:hola@ryuheirg.dev", icon: "email" },
  ],
  nav: [
    { label: "Blog", href: "/blog" },
    { label: "Proyectos", href: "/proyectos" },
    { label: "Sobre mí", href: "/sobre-mi" },
  ],
  footer: {
    note: "Construido con intención.",
    links: [
      { label: "GitHub", href: "https://github.com/RyuheiRG" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/ryuhei-rg/" },
      { label: "RSS", href: "/rss.xml" },
      { label: "Privacidad", href: "/privacidad" },
    ],
  },
  seo_defaults: {
    title: "Ryoko — Ricardo Reyes Gómez | Full Stack + Security",
    description:
      "Proyectos full stack, seguridad y notas técnicas de Ricardo Reyes Gómez, estudiante de ITID en UPChiapas.",
    og_image: "/og/home.png",
    canonical_url: null,
    noindex: false,
  },
  features: { ads_enabled: false },
};
