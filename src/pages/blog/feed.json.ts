import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import MarkdownItFootnote from "markdown-it-footnote";

export async function GET(context: APIContext) {
  const blog = await getCollection("blog");
  const parser = new MarkdownIt({ html: true }).use(MarkdownItFootnote);
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
          "id": "${context.site}blog/${post.slug}/",
          "url": "${context.site}blog/${post.slug}/",
          "title": "${post.data.title}",
          "content_html": "${sanitizeHtml(
            parser.render(post.body).replace('src="/', `src="${context.site!.toString()}`).replace('href="/', `href="${context.site!.toString()}`),
            {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"])
            }
          ).replace(/"/g, '\\\"').replace(/\r?\n|\r/g, '\\n').trim()}",
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
