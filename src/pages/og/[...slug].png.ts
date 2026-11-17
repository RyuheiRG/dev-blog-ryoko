import sharp from "sharp";
import type { APIRoute } from "astro";

import { getAllPosts, getAllProjects, getTags } from "@/lib/cms/queries";

type OgProps = {
  label: string;
  title: string;
  meta: string;
};

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => XML_ESCAPES[char] ?? char);
}

function wrapTitle(title: string, maxChars: number, maxLines = 3): string[] {
  const words = title.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(current);
  }

  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1]?.replace(/[.,;:]$/, "")}…`;
    return kept;
  }

  return lines;
}

function renderOgSvg({ label, title, meta }: OgProps): string {
  const lines = wrapTitle(title, title.length > 42 ? 32 : 24);
  const fontSize = lines.length >= 3 ? 68 : lines.length === 2 ? 78 : 88;
  const lineHeight = Math.round(fontSize * 1.08);
  const startY = 300 - ((lines.length - 1) * lineHeight) / 2;

  const titleLines = lines
    .map(
      (line, index) =>
        `<text x="80" y="${startY + index * lineHeight}" fill="#f2f1ef" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" letter-spacing="-2">${escapeXml(line)}</text>`,
    )
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#090a0c"/>
  <defs>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M80 0H0V80" fill="none" stroke="#f2f1ef" stroke-opacity="0.04"/>
    </pattern>
    <radialGradient id="glow" cx="78%" cy="18%" r="45%">
      <stop offset="0%" stop-color="#c1121f" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#c1121f" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="6" fill="#c1121f"/>

  <circle cx="1050" cy="116" r="42" fill="none" stroke="#c1121f" stroke-width="2"/>
  <circle cx="1050" cy="116" r="22" fill="none" stroke="#f04452" stroke-width="1.5"/>
  <circle cx="1050" cy="116" r="9" fill="#c1121f"/>

  <text x="80" y="126" fill="#f04452" font-family="'Courier New', monospace" font-size="20" letter-spacing="4">${escapeXml(label.toUpperCase())}</text>

  ${titleLines}

  <line x1="80" y1="530" x2="1120" y2="530" stroke="#2b2d31" stroke-width="1"/>
  <text x="80" y="574" fill="#6f7175" font-family="'Courier New', monospace" font-size="18" letter-spacing="3">RYOKO / KARASU</text>
  <text x="1120" y="574" fill="#a5a6a8" font-family="'Courier New', monospace" font-size="18" letter-spacing="2" text-anchor="end">${escapeXml(meta.toUpperCase())}</text>
</svg>`;
}

export async function getStaticPaths() {
  const [posts, projects, tags] = await Promise.all([
    getAllPosts(),
    getAllProjects(),
    getTags(),
  ]);

  return [
    {
      params: { slug: "home" },
      props: { label: "Ryoko / Karasu", title: "Sistemas con intención.", meta: "Full stack + Security" },
    },
    {
      params: { slug: "blog" },
      props: {
        label: "Ryoko / Bitácora",
        title: "Notas de lo que construyo, rompo y aprendo.",
        meta: "Blog",
      },
    },
    {
      params: { slug: "proyectos" },
      props: {
        label: "Ryoko / Trabajo",
        title: "Sistemas con contexto y decisiones.",
        meta: "Proyectos",
      },
    },
    {
      params: { slug: "sobre-mi" },
      props: {
        label: "Ryoko / Sobre mí",
        title: "Ricardo Reyes Gómez.",
        meta: "UPChiapas / ITID",
      },
    },
    {
      params: { slug: "privacidad" },
      props: { label: "Ryoko / Legal", title: "Privacidad sin letra pequeña.", meta: "Privacidad" },
    },
    {
      params: { slug: "etiquetas" },
      props: { label: "Ryoko / Índice", title: "Etiquetas de la bitácora.", meta: "Etiquetas" },
    },
    ...posts.map((post) => ({
      params: { slug: `blog/${post.slug}` },
      props: {
        label: "Ryoko / Bitácora",
        title: post.title,
        meta: `${post.reading_time_minutes} min · ${post.tags.map((tag) => tag.name).join(" · ")}`,
      },
    })),
    ...projects.map((project) => ({
      params: { slug: `proyectos/${project.slug}` },
      props: {
        label: `Ryoko / Proyecto / ${project.year}`,
        title: project.title,
        meta: project.stack.slice(0, 3).join(" · "),
      },
    })),
    ...tags.map((tag) => ({
      params: { slug: `etiquetas/${tag.slug}` },
      props: {
        label: "Ryoko / Etiqueta",
        title: tag.name,
        meta: `${tag.post_count ?? 0} posts`,
      },
    })),
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const svg = renderOgSvg(props as OgProps);
  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
