import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { remarkMastodonEmbed } from "astro-mastodon";
import { rehypeCustomEmoji } from "@rubenarakelyan/rehype-custom-emoji";
import { remarkReadingTime } from "./plugins/remark-reading-time.mjs";
import { customEmoji } from "./plugins/custom-emoji.mjs";

// https://astro.build/config
export default defineConfig({
  output: "static",
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: "github-dark" }],
      [rehypeCustomEmoji, { emoji: customEmoji }]
    ],
    remarkPlugins: [
      remarkReadingTime,
      remarkMastodonEmbed
    ]
  },
  site: process.env.NODE_ENV === "development" ? "http://localhost:4321" : "https://www.wackomenace.co.uk",
  integrations: [mdx({ syntaxHighlight: false }), sitemap(), tailwind()],
  redirects: {
    "/.well-known/recommendations.opml": "/blogroll/rubenarakelyan.opml",
    "/.well-known/webfinger": "/.well-known/webfinger.json",
    "/blog/random": "/blog/16-dynamic-to-static/#no-more-random-blog-posts",
    "/guestbook": "/blog/16-dynamic-to-static/#guestbook---gone",
    "/save": "/",
    "/search": "/"
  },
  vite: {
    ssr: {
      external: ["node:child_process", "node:fs", "node:path"]
    }
  }
});
