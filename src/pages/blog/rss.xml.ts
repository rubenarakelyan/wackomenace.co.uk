import type { APIContext } from "astro";
import rss from "@astrojs/rss";
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

  return rss({
    stylesheet: "/assets/rss.xsl",
    title: "wackomenace",
    description: "Ruben Arakelyan’s home on the web",
    site: context.site!.toString(),
    items: await Promise.all(blog.map(async (post) => ({
      title: post.data.title,
      link: `/blog/${post.slug}/`,
      description: post.data.excerpt,
      content: String(await parser.process(post.body)).replaceAll('src="/', `src="${context.site!.toString()}`).replaceAll('href="/', `href="${context.site!.toString()}`),
      pubDate: post.data.date,
    }))),
    customData: `
      <language>en-gb</language>
      <copyright>Copyright © 2024 Ruben Arakelyan. All work licensed under CC BY-SA 4.0 unless otherwise stated.</copyright>
      <category>Blogs</category>
      <generator>${context.generator}</generator>
      <docs>https://www.rssboard.org/rss-specification</docs>
      <ttl>60</ttl>
      <image>
        <url>https://www.wackomenace.co.uk/images/logo.png</url>
        <title>wackomenace</title>
        <link>https://www.wackomenace.co.uk/</link>
        <width>111</width>
        <height>111</height>
      </image>
      <source:blogroll>https://www.wackomenace.co.uk/blogroll/rubenarakelyan.opml</source:blogroll>
    `,
    xmlns: {
      source: "http://source.scripting.com/",
    },
  });
}

export async function getStaticPaths() {
  const blog = await getCollection("blog");
  return blog.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
