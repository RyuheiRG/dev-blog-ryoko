import rss from "@astrojs/rss";
import type { APIRoute } from "astro";

import { getAllPosts, getSiteSettings } from "@/lib/cms/queries";

export const GET: APIRoute = async (context) => {
  const [posts, site] = await Promise.all([getAllPosts(), getSiteSettings()]);

  return rss({
    title: "Ryoko — Bitácora",
    description:
      "Notas técnicas, decisiones de arquitectura y cosas que aprendo mientras construyo.",
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.published_at),
      description: post.excerpt,
      link: `/blog/${post.slug}/`,
      categories: post.tags.map((tag) => tag.name),
    })),
    customData: "<language>es-MX</language>",
  });
};
