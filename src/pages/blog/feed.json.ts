import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { unified } from "unified";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { rehypeCustomEmoji } from "@rubenarakelyan/rehype-custom-emoji";
import { customEmoji } from "./plugins/custom-emoji.mjs";

export async function GET(context: APIContext) {
  const blog = (await getCollection("blog")).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const parser = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true, footnoteLabelTagName: "hr" })
    .use(rehypeCustomEmoji, { emoji: customEmoji })
    .use(rehypeFormat)
    .use(rehypeStringify, { allowDangerousHtml: true });

  return new Response(
      `{
  "version": "https://jsonfeed.org/version/1.1",
  "title": "wackomenace",
  "home_page_url": "${context.site}",
  "feed_url": "${context.site}blog/feed.json",
  "description": "Ruben Arakelyan’s home on the web",
  "icon": "${context.site}images/logo.png",
  "favicon": "${context.site}images/logo.png",
  "authors": [
    {
      "name": "Ruben Arakelyan"
    }
  ],
  "language": "en-GB",
  "items": [
    ${
      await Promise.all(blog.map(async (post) =>
        `{
          "id": "${context.site}blog/${post.slug}/",
          "url": "${context.site}blog/${post.slug}/",
          "title": "${post.data.title}",
          "content_html": "${String(await parser.process(post.body)).replaceAll('src="/', `src="${context.site!.toString()}`).replaceAll('href="/', `href="${context.site!.toString()}`).replace(/"/g, '\\\"').replace(/\r?\n|\r/g, '\\n').trim()}",
          "summary": "${post.data.excerpt}",
          "date_published": "${new Date(post.data.date).toJSON()}"
        }`
      ))
    }
  ]
}`,
    {
      headers: {
        "Content-Type": "application/feed+json; charset=utf-8",
      }
    }
  )
}

export async function getStaticPaths() {
  const blog = await getCollection("blog");
  return blog.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
