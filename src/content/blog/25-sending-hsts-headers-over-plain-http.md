---
title: Sending HSTS headers over plain HTTP
date: 2025-02-18
excerpt: Why I’m sending the HSTS header over plain HTTP but not redirecting to HTTPS.
---

> This post is part of a series on hosting my website locally - also see [moving to local hosting](/blog/23-moving-to-local-hosting/) and [deploying an Astro site to Synology](/blog/24-deploying-an-astro-site-to-synology/).

[Last time](/blog/24-deploying-an-astro-site-to-synology/), I deployed my Astro site to my Synology NAS for hosting. I set it up to use Apache HTTP server which means I can use `.htaccess` files to control HTTP headers, amongst other things.

I decided to use Fastly for a number of reasons to front the site, but one important one is that it makes managing TLS certificates much easier than doing it on the Synology NAS. However, I wanted to keep unencrypted HTTP access an option for old browsers that don’t support modern encryption. In Fastly, I made sure to disable the option to force redirects to HTTPS. This also disables the option to send HSTS headers, since they are both controlled by one setting. I can see the reasons behind this decision since on the first ever visit to a site, the user’s browser does not know about the header. By redirecting to HTTPS and also sending the header, site owners can be sure that their sites are always only being accessed over HTTPS.

I decided to go with a hybrid approach instead - I don’t redirect to HTTPS, but I use the `.htaccess` file to instruct Apache to send an HSTS header. This way, browsers that understand HSTS (which generally also means they support modern encryption) will mark the site as HTTPS-only from the second request onwards, whilst browsers that don’t know what HSTS is can continue to use HTTP. The first visit issue isn’t solved by this, but being a static site, any potential issues are minimal.

I did, however, encounter an issue in that the [Security Headers](https://securityheaders.com) site marks down this site since I send the HSTS header over plain HTTP as well as HTTPS and don’t redirect. [According to](https://scotthelme.co.uk/hsts-the-missing-link-in-tls/) Scott Helme, who originally wrote the tool, this is because a malicious actor could send a fake HSTS header over HTTP to cause issues. I don’t know if any browsers follow this advice and ignore HSTS over HTTP, and I wouldn’t recommend sites with anything that needs securing (such as payments, logins etc) to follow this approach, but it works for me and the risks are minimal.
