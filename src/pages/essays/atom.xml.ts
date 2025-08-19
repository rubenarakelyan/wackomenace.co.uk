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
      `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="/assets/atom.xsl" type="text/xsl"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${context.site}</id>
  <title>wackomenace</title>
  <updated>${new Date().toJSON()}</updated>
  <author>
    <name>Ruben Arakelyan</name>
  </author>
  <link href="${context.site}" />
  <link rel="self" href="${context.site}essays/atom.xml" />
  <category term="blogs" />
  <generator>${context.generator}</generator>
  <icon>${context.site}images/logo.png</icon>
  <rights>Copyright © 2024-2025 Ruben Arakelyan. All rights reserved.</rights>
  <subtitle>Ruben Arakelyan’s home on the web</subtitle>
  ${
    (await Promise.all(essays.map(async essay =>
      `<entry>
        <id>${context.site}essays/${essay.id}/</id>
        <title>${essay.data.title}</title>
        <updated>${new Date(essay.data.updated).toJSON()}</updated>
        <content type="xhtml">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${String(await parser.process(essay.body)).replaceAll('src="/', `src="${context.site!.toString()}`).replaceAll('href="/', `href="${context.site!.toString()}`).replaceAll('href="#', `href="${context.site!.toString()}essays/${essay.id}/#`)}
          </div>
        </content>
        <link rel="alternate" href="${context.site}essays/${essay.id}/" />
        <summary>${essay.data.excerpt}</summary>
        <published>${new Date(essay.data.updated).toJSON()}</published>
      </entry>`
    ))).join("")
  }
</feed>
    `,
    {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
      }
    }
  )
}
