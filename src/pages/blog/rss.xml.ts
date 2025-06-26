import type { APIContext } from "astro";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { unified } from "unified";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog")).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const parser = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true, footnoteLabelTagName: "hr" })
    .use(rehypeFormat)
    .use(rehypeStringify, { allowDangerousHtml: true });

  return rss({
    stylesheet: "/assets/rss.xsl",
    title: "wackomenace",
    description: "Ruben Arakelyan’s home on the web",
    site: context.site!.toString(),
    items: await Promise.all(posts.map(async post => ({
      title: post.data.title,
      link: `/blog/${post.id}/`,
      description: post.data.excerpt,
      content: String(await parser.process(post.body)).replaceAll('src="/', `src="${context.site!.toString()}`).replaceAll('href="/', `href="${context.site!.toString()}`).replaceAll('href="#', `href="${context.site!.toString()}blog/${post.id}/#`),
      pubDate: post.data.date,
    }))),
    customData: `
      <language>en-gb</language>
      <copyright>Copyright © 2024-2025 Ruben Arakelyan. All work licensed under CC BY-SA 4.0 unless otherwise stated.</copyright>
      <category>Blogs</category>
      <generator>${context.generator}</generator>
      <docs>https://www.rssboard.org/rss-specification</docs>
      <ttl>60</ttl>
      <image>
        <url>${context.site}images/logo.png</url>
        <title>wackomenace</title>
        <link>${context.site}</link>
        <width>111</width>
        <height>111</height>
      </image>
      <source:blogroll>${context.site}blogroll/rubenarakelyan.opml</source:blogroll>
    `,
    xmlns: {
      source: "http://source.scripting.com/",
    },
  });
}
