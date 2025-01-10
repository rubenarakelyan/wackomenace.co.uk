---
title: Dynamic to static
date: 2024-08-22
excerpt: Why I’m moving away from dynamic sites back to static.
---

When I built the new wackomenace site a few months ago, I decided to go with Astro as the framework (party because I wanted to learn it anyway), but had to make a decision about where and how to host it. Taking inspiration from the Astro documentation and the fact I was already using Cloudflare for domain registration and some static hosting, I want with Cloudflare Pages, where it was very convenient to set up the build process and see my site a minute or so later.

I always had in the back of my mind, however, that Cloudflare is one of those large corporations who take you in with free services (such as static hosting, DNS etc) and then lock you in and upsell you for all you have. For a while, I’d wanted to move away to somewhere more ethical and closer to the developer mindset (like I’d done with A&A for Internet access) but first, I had to get reacquainted with paying for hosting rather than expecting it for free.

I’d heard good things about [Mythic Beasts](https://www.mythic-beasts.com) from a few friends and acquaintances so I decided to go with them, and I went all-in. I transferred all my domains across from Cloudflare and ordered a couple of VPSs. I used one to set up a mail server (open question as to whether I’ll keep this or not) and the other for all my hosting needs. I packaged up each of the sites I’d hosted on Cloudflare Pages into Docker images and deployed them all to this VPS. After a few minor hiccups, it all worked well. I even decided to use this newly powerful VPS to host [Monica CRM](https://www.monicahq.com) and [Gitea](https://about.gitea.com) to take some more control for my own data.

However, it was always niggling me that I’d just opened myself up to even more sysadmin work with this move, whereas my general attempted direction of travel recently is to reduce the number of such hidden commitments that I have. Noticing that most of my sites were static (or could easily be static), I decided to plunge for the previously unthinkable and move them to shared hosting, like the good old days. To start with, I got rid of Monica CRM and Gitea, neither of which I’d really started to use. They were just another sysadmin burden that I didn’t want right now.

Mythic Beasts offers very good value shared hosting packages that include unlimited domains and PHP for scripting. Once I’d moved all my static sites over, I was left with wackomenace. I first set it up as a “hybrid” Astro site because it seemed to have the best of both worlds. I wanted to see if I could change this to fully-static and move it over too. I found a total of three places where I was using the dynamic functionality of Astro, none of them critical, so I decided to go for it. And so, with that move, here’s what’s changed:

## No more random blog posts

I had one button hidden away on a page that would select a random blog post and take you to it. I don’t think anyone ever used it, so off it went.

## Same search but different

The search page takes a query and redirects you to a scoped DuckDuckGo search. I replaced this with a small PHP script on a subdomain so I could make the page itself static and just send the query to the script. Everything works the same way it did before.

## Guestbook - gone

This was maybe the most contentious move, since I had a couple of people post their messages of support on it. However, traction wasn’t that great and I was getting overwhelmed with spam that I needed to manage weekly. I decided it wasn’t worth the effort to write a new PHP script to handle this, so again, off it went.

## Where that leaves me

With those changes, I was able to convert wackomenace to a static site and move it to the shared hosting, thereby completing my move away from both Cloudflare Pages and managing my own VPS. Life has become much simpler, with less admin work and hand-holding to do. Best of all, when I do need a quick script to do something, PHP (and even CGI) is available and waiting.
