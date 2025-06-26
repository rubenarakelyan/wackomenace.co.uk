// @ts-check
import { defineConfig } from "astro/config";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import { remarkReadingTime } from "./plugins/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  integrations: [sitemap(), tailwind()],
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: "github-dark" }]
    ],
    remarkPlugins: [
      remarkReadingTime
    ]
  },
  output: "server",
  site: process.env.NODE_ENV === "development" ? "http://localhost:4321" : "https://www.wackomenace.co.uk",
  redirects: {
    "/.well-known/recommendations.opml": "/blogroll/rubenarakelyan.opml",
    "/contact": "/",
    "/guestbook": "/blog/16-dynamic-to-static/#guestbook---gone",
    "/save": "/"
  }
});
