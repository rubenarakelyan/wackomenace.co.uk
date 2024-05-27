import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import MarkdownItFootnote from "markdown-it-footnote";

export async function GET(context: APIContext) {
  const blog = (await getCollection("blog")).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const parser = new MarkdownIt({ html: true }).use(MarkdownItFootnote);
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
  <link rel="self" href="${context.site}blog/atom.xml" />
  <category term="blogs" />
  <generator>${context.generator}</generator>
  <icon>${context.site}images/logo.png</icon>
  <rights>Copyright © 2024 Ruben Arakelyan. All work licensed under CC BY-SA 4.0 unless otherwise stated.</rights>
  <subtitle>Ruben Arakelyan’s home on the web</subtitle>
  ${
    blog.map((post) =>
      `<entry>
        <id>${context.site}blog/${post.slug}/</id>
        <title>${post.data.title}</title>
        <updated>${new Date(post.data.date).toJSON()}</updated>
        <content type="xhtml">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${sanitizeHtml(
              parser.render(post.body).replace('src="/', `src="${context.site!.toString()}`).replace('href="/', `href="${context.site!.toString()}`),
              {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"])
              }
            )}
          </div>
        </content>
        <link rel="alternate" href="${context.site}blog/${post.slug}" />
        <summary>${post.data.excerpt}</summary>
        <published>${new Date(post.data.date).toJSON()}</published>
      </entry>`
    ).join("")
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

export async function getStaticPaths() {
  const blog = await getCollection("blog");
  return blog.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
