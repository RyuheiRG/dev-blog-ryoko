import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const site = process.env.PUBLIC_SITE_URL || "https://ryuheirg.dev";

export default defineConfig({
  site,
  output: "static",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/og/") && !page.includes("/404"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: "auto",
  },
});
