import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";

export async function GET(context: APIContext) {
  const blog = await getCollection("blog");
  const parser = new MarkdownIt();
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
      blog.toReversed().map((post) =>
        `{
          "id": "${context.site}blog/${post.slug}",
          "url": "${context.site}blog/${post.slug}",
          "title": "${post.data.title}",
          "content_html": "${sanitizeHtml(parser.render(post.body)).replace(/"/g, '\\\"').trim()}",
          "summary": "${post.data.excerpt}",
          "date_published": "${new Date(post.data.date).toJSON()}"
        }`
      )
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
