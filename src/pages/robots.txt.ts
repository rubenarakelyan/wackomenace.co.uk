import type { APIRoute } from "astro";

const robotsTxt = `
Sitemap: ${new URL('sitemap-index.xml', import.meta.env.SITE).href}

User-agent: *
Allow: /

User-agent: AdsBot-Google
User-agent: Amazonbot
User-agent: anthropic-ai
User-agent: Applebot
User-agent: AwarioRssBot
User-agent: AwarioSmartBot
User-agent: Bytespider
User-agent: CCBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-Web
User-agent: cohere-ai
User-agent: DataForSeoBot
User-agent: FacebookBot
User-agent: Google-Extended
User-agent: GoogleOther
User-agent: GPTBot
User-agent: ImagesiftBot
User-agent: magpie-crawler
User-agent: Meltwater
User-agent: omgili
User-agent: omgilibot
User-agent: peer39_crawler
User-agent: peer39_crawler/1.0
User-agent: PerplexityBot
User-agent: Seekr
User-agent: YouBot
Disallow: /
`.trim();

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
