import GithubSlugger from "github-slugger";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import rehypeShiki from "@shikijs/rehype";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

export type TocItem = {
  depth: 2 | 3;
  text: string;
  id: string;
};

const sanitizeSchema: NonNullable<Parameters<typeof rehypeSanitize>[0]> = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), ["className", /^language-./]],
    pre: [...(defaultSchema.attributes?.pre ?? []), ["className", /^language-./]],
    h2: [...(defaultSchema.attributes?.h2 ?? []), "id"],
    h3: [...(defaultSchema.attributes?.h3 ?? []), "id"],
    h4: [...(defaultSchema.attributes?.h4 ?? []), "id"],
    a: [...(defaultSchema.attributes?.a ?? []), "target", "rel"],
  },
};

function rehypeExternalLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return;
      const href = node.properties?.href;
      if (typeof href !== "string" || !/^https?:\/\//.test(href)) return;
      node.properties = {
        ...node.properties,
        target: "_blank",
        rel: ["noopener", "noreferrer"],
      };
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSanitize, sanitizeSchema)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: "append",
    properties: {
      className: ["heading-anchor"],
      ariaHidden: "true",
      tabIndex: -1,
    },
    content: { type: "text", value: "#" },
  })
  .use(rehypeExternalLinks)
  .use(rehypeShiki, {
    theme: "vesper",
  })
  .use(rehypeStringify);

export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await processor.process(markdown);
  return String(file);
}

function plainHeading(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_~]/g, "")
    .trim();
}

export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(##|###)\s+(.+)$/.exec(line);
    if (!match) continue;

    const depth = match[1] === "##" ? 2 : 3;
    const text = plainHeading(match[2]);
    items.push({ depth, text, id: slugger.slug(text) });
  }

  return items;
}
