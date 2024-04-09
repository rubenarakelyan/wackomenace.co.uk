import type { APIContext } from "astro";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";

export async function GET(context: APIContext) {
  const blog = await getCollection("blog");
  const parser = new MarkdownIt();
  return rss({
    stylesheet: "/assets/rss.xsl",
    title: "wackomenace",
    description: "Ruben Arakelyan’s home on the web",
    site: context.site!.toString(),
    items: blog.toReversed().map((post) => ({
      title: post.data.title,
      link: `/blog/${post.slug}/`,
      description: post.data.excerpt,
      content: sanitizeHtml(parser.render(post.body)),
      pubDate: post.data.date,
    })),
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
    `,
  });
}

export async function getStaticPaths() {
  const blog = await getCollection("blog");
  return blog.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
