// @ts-check
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import { remarkReadingTime } from "./plugins/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  integrations: [expressiveCode(), sitemap()],
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { rel: ["nofollow"] }],
      rehypeSlug
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
  },
  vite: {
    plugins: [tailwindcss()]
  },
  experimental: {
    fonts: [
      {
        provider: "local",
        name: "IBM Plex Sans",
        cssVariable: "--font-ibm-plex-sans",
        fallbacks: ["sans-serif"],
        variants: [
          {
            weight: "normal",
            style: "normal",
            src: ["./src/assets/fonts/IBMPlexSans-Regular.woff2", "./src/assets/fonts/IBMPlexSans-Regular.woff"]
          },
          {
            weight: "bold",
            style: "normal",
            src: ["./src/assets/fonts/IBMPlexSans-SemiBold.woff2", "./src/assets/fonts/IBMPlexSans-SemiBold.woff"]
          },
          {
            weight: "normal",
            style: "italic",
            src: ["./src/assets/fonts/IBMPlexSans-Italic.woff2", "./src/assets/fonts/IBMPlexSans-Italic.woff"]
          },
          {
            weight: "bold",
            style: "italic",
            src: ["./src/assets/fonts/IBMPlexSans-SemiBoldItalic.woff2", "./src/assets/fonts/IBMPlexSans-SemiBoldItalic.woff"]
          }
        ]
      },
      {
        provider: "local",
        name: "IBM Plex Serif",
        cssVariable: "--font-ibm-plex-serif",
        fallbacks: ["serif"],
        variants: [
          {
            weight: "normal",
            style: "normal",
            src: ["./src/assets/fonts/IBMPlexSerif-Regular.woff2", "./src/assets/fonts/IBMPlexSerif-Regular.woff"]
          },
          {
            weight: "bold",
            style: "normal",
            src: ["./src/assets/fonts/IBMPlexSerif-SemiBold.woff2", "./src/assets/fonts/IBMPlexSerif-SemiBold.woff"]
          },
          {
            weight: "normal",
            style: "italic",
            src: ["./src/assets/fonts/IBMPlexSerif-Italic.woff2", "./src/assets/fonts/IBMPlexSerif-Italic.woff"]
          },
          {
            weight: "bold",
            style: "italic",
            src: ["./src/assets/fonts/IBMPlexSerif-SemiBoldItalic.woff2", "./src/assets/fonts/IBMPlexSerif-SemiBoldItalic.woff"]
          }
        ]
      },
      {
        provider: "local",
        name: "IBM Plex Mono",
        cssVariable: "--font-ibm-plex-mono",
        fallbacks: ["monospace"],
        variants: [
          {
            weight: "normal",
            style: "normal",
            src: ["./src/assets/fonts/IBMPlexMono-Regular.woff2", "./src/assets/fonts/IBMPlexMono-Regular.woff"]
          },
          {
            weight: "bold",
            style: "normal",
            src: ["./src/assets/fonts/IBMPlexMono-SemiBold.woff2", "./src/assets/fonts/IBMPlexMono-SemiBold.woff"]
          },
          {
            weight: "normal",
            style: "italic",
            src: ["./src/assets/fonts/IBMPlexMono-Italic.woff2", "./src/assets/fonts/IBMPlexMono-Italic.woff"]
          },
          {
            weight: "bold",
            style: "italic",
            src: ["./src/assets/fonts/IBMPlexMono-SemiBoldItalic.woff2", "./src/assets/fonts/IBMPlexMono-SemiBoldItalic.woff"]
          }
        ]
      }
    ]
  }
});
