import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: cloudflare(),
  site: process.env.NODE_ENV === "development" ? "http://localhost:4321" : "https://www.wackomenace.co.uk",
  integrations: [
    mdx({
      syntaxHighlight: false,
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: "github-dark",
          },
        ],
      ],
    }),
    sitemap(),
    tailwind(),
  ],
});
