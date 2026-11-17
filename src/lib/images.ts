import type { ImageMetadata } from "astro";

import portrait from "@/assets/images/portrait.jpeg";
import secureup from "@/assets/images/secureup.png";
import vacaCubica from "@/assets/images/vaca-cubica.png";

import astroIcon from "@/assets/icons/tech/Astro.png";
import cppIcon from "@/assets/icons/tech/CPlusPlus.png";
import cssIcon from "@/assets/icons/tech/CSS3.png";
import dockerIcon from "@/assets/icons/tech/Docker.png";
import expressIcon from "@/assets/icons/tech/Express.png";
import figmaIcon from "@/assets/icons/tech/Figma.png";
import gitIcon from "@/assets/icons/tech/Git.png";
import htmlIcon from "@/assets/icons/tech/HTML5.png";
import javascriptIcon from "@/assets/icons/tech/JavaScript.png";
import jestIcon from "@/assets/icons/tech/Jest.png";
import linuxIcon from "@/assets/icons/tech/Linux.png";
import mysqlIcon from "@/assets/icons/tech/MySQL.png";
import nginxIcon from "@/assets/icons/tech/NGINX.png";
import nodeIcon from "@/assets/icons/tech/Node.js.png";
import postmanIcon from "@/assets/icons/tech/Postman.png";
import pythonIcon from "@/assets/icons/tech/Python.png";
import reactIcon from "@/assets/icons/tech/React.png";
import redisIcon from "@/assets/icons/tech/Redis.png";
import tailwindIcon from "@/assets/icons/tech/TailwindCSS.png";
import typescriptIcon from "@/assets/icons/tech/TypeScript.png";
import ubuntuIcon from "@/assets/icons/tech/Ubuntu.png";
import vercelIcon from "@/assets/icons/tech/Vercel.png";
import viteIcon from "@/assets/icons/tech/Vite.js.png";
import vscodeIcon from "@/assets/icons/tech/VSCode.png";

/**
 * Assets locales indexados por el UUID del media en los mocks.
 * Debe coincidir con `src/data/mock/media.ts`.
 */
export const mockMediaAssets: Record<string, ImageMetadata> = {
  "7d1a4c2e-8f3b-4a5d-9c6e-1b2a3c4d5e6f": portrait,
  "9b2c5d3f-1a4e-4f6b-8c7d-2e3f4a5b6c7d": secureup,
  "5e3f7a1b-2c4d-4e5f-9a6b-3c4d5e6f7a8b": vacaCubica,
};

export const techIcons: Record<string, ImageMetadata> = {
  astro: astroIcon,
  cpp: cppIcon,
  css3: cssIcon,
  docker: dockerIcon,
  express: expressIcon,
  figma: figmaIcon,
  git: gitIcon,
  html5: htmlIcon,
  javascript: javascriptIcon,
  jest: jestIcon,
  linux: linuxIcon,
  mysql: mysqlIcon,
  nginx: nginxIcon,
  node: nodeIcon,
  postman: postmanIcon,
  python: pythonIcon,
  react: reactIcon,
  redis: redisIcon,
  tailwind: tailwindIcon,
  typescript: typescriptIcon,
  ubuntu: ubuntuIcon,
  vercel: vercelIcon,
  vite: viteIcon,
  vscode: vscodeIcon,
};

/** Devuelve un asset local optimizable si el media es de mock. */
export function localAsset(mediaId: string): ImageMetadata | undefined {
  return mockMediaAssets[mediaId];
}
