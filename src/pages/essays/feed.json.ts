import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { unified } from "unified";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

export async function GET(context: APIContext) {
  const essays = (await getCollection("essays")).sort((a, b) => b.data.updated.valueOf() - a.data.updated.valueOf());
  const parser = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true, footnoteLabelTagName: "hr" })
    .use(rehypeFormat)
    .use(rehypeStringify, { allowDangerousHtml: true });

  return new Response(
      `{
  "version": "https://jsonfeed.org/version/1.1",
  "title": "wackomenace",
  "home_page_url": "${context.site}",
  "feed_url": "${context.site}essays/feed.json",
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
      await Promise.all(essays.map(async essay =>
        `{
          "id": "${context.site}essays/${essay.id}/",
          "url": "${context.site}essays/${essay.id}/",
          "title": "${essay.data.title}",
          "content_html": "${String(await parser.process(essay.body)).replaceAll('src="/', `src="${context.site!.toString()}`).replaceAll('href="/', `href="${context.site!.toString()}`).replaceAll('href="#', `href="${context.site!.toString()}essays/${essay.id}/#`).replace(/"/g, '\\\"').replace(/\r?\n|\r/g, '\\n').trim()}",
          "summary": "${essay.data.excerpt}",
          "date_published": "${new Date(essay.data.updated).toJSON()}"
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
