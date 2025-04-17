// @ts-check
import { defineConfig } from "astro/config";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import sitemap from "@astrojs/sitemap";
import { remarkReadingTime } from "./plugins/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: "github-dark" }]
    ],
    remarkPlugins: [
      remarkReadingTime
    ]
  },
  site: process.env.NODE_ENV === "development" ? "http://localhost:4321" : "https://www.wackomenace.co.uk",
  integrations: [sitemap()],
  redirects: {
    "/blog/random": "/blog/16-dynamic-to-static/#no-more-random-blog-posts",
    "/contact": "/",
    "/guestbook": "/blog/16-dynamic-to-static/#guestbook---gone",
    "/save": "/",
    "/search": "/"
  }
});
