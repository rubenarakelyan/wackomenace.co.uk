---
title: "Building Authmenace: an IndieAuth server"
date: 2024-05-07
excerpt: A super-simple IndieAuth authorization and token endpoint with no database.
tags: [indieweb, indieauth, auth, server]
---

Since starting to build wackomenace, I’ve wanted to participate as fully as possible in the IndieWeb ecosystem. The term “IndieWeb” encompasses a number of standards and services that can be added to websites to improve cross-collaboration and bypass usage of the largest players on the web for things like authenticating yourself on other websites.

Things like adding support for microformats is the easy part, and I did this as I was first building the Astro templates and preparing to launch wackomenace. Then there are the more complicated parts, of which IndieAuth forms one part. IndieAuth allows someone with a domain name to use that as their method of authentication with other websites. The actual authentication happens on whatever service is declared by that domain to be used for auth requests. The service then returns a token to the original website as proof of successful authentication.

One of the most popular ways of implementing IndieAuth on a website is to outsource it to [IndieAuth.com](https://www.indieauth.com). This is a service built by Aaron Parecki (who incidentally is doing the Lord’s work on building, hosting and advocating for IndieWeb standards and services) to implement authentication with multiple external providers without having to maintain their own codebase. However, part of the IndieWeb ethos is to try to host things yourself where practical to reduce reliance on external systems and businesses.

With this in mind, and wanting to have an IndieAuth implementation available to sign up to the [IndieWeb webring](https://xn--sr8hvo.ws), I decided to see what was out there in terms of self-hosting. I found a few projects, mostly abandoned and none of them implementing exactly what I wanted - a database-less, super-simple codebase written in Ruby and currently maintained. Having found nothing, I decided to strike out and build something myself. The result is [Authmenace](https://github.com/rubenarakelyan/authmenace).

I use Authmenace myself on wackomenace to sign in to IndieAuth-based websites, and you can use it too, on your own server. It uses JWTs (JSON web tokens) with strict checking of all parameters (issuer, expiry date etc) which means it doesn’t need a database to keep track of valid tokens and is as simple as I could get it. This also means it can run on hosts such as [NearlyFreeSpeech.net](https://www.nearlyfreespeech.net) (where I’m hosting it) which means I pay a grand total of $0.01/day.

Let me know if you decide to host and use Authmenace on your own website - I’m interested in hearing other peoples’ use-cases and feedback.
