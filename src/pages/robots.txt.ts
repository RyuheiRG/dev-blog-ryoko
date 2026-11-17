import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://ryuheirg.dev");
  const sitemap = new URL("sitemap-index.xml", base).toString();

  const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${sitemap}`, ""].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
