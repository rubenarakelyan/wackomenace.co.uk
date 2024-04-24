import type { APIRoute } from "astro";

const webfinger = {
  "subject": "acct:ruben@ruby.social",
  "aliases": [
    "https://ruby.social/@ruben",
    "https://ruby.social/users/ruben"
  ],
  "links": [
    {
      "rel": "http://webfinger.net/rel/avatar",
      "href": "https://www.wackomenace.co.uk/images/ruben.png",
      "type": "image/png"
    },
    {
      "rel": "http://webfinger.net/rel/profile-page",
      "href": "https://ruby.social/users/ruben",
      "type": "text/html"
    },
    {
      "rel": "self",
      "href": "https://ruby.social/users/ruben",
      "type": "application/activity+json"
    },
    {
      "rel": "http://ostatus.org/schema/1.0/subscribe",
      "template": "https://ruby.social/authorize_interaction?uri={uri}"
    }
  ]
};

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(webfinger), {
    headers: {
      "Content-Type": "application/jrd+json; charset=utf-8",
    },
  });
};
