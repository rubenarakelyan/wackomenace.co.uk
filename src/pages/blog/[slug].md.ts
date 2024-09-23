import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const post = await import(`../../content/blog/${context.params.slug}.md`);

  return new Response(
    content(post),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      }
    }
  )
}

export async function getStaticPaths() {
  const blog = await getCollection("blog");
  return blog.map((post) => ({
    params: { slug: post.slug },
  }));
}

function content(post) {
  const response = `${post.frontmatter.title}
${"=".repeat(post.frontmatter.title.length)}

Posted: ${new Date(post.frontmatter.date).toLocaleDateString("en-GB")}
${post.rawContent()}
  `;

  return response;
}
