---
title: Moving to local hosting
date: 2025-02-16
updated: 2025-06-30
excerpt: I’ve made the plunge to host my website myself and have full control.
---

> This post is part of a series on hosting my website locally - also see [deploying an Astro site to Synology](/blog/24-deploying-an-astro-site-to-synology/) and [sending HSTS headers over plain HTTP](/blog/25-sending-hsts-headers-over-plain-http/).

In a [previous blog post](/blog/18-moving-away-from-cloudflare/), I wrote about moving to shared hosting with [Mythic Beasts](https://www.mythic-beasts.com) and turning the site static for simplicity.

Since I never seem to tire of tweaking things and can never stay still (and since it was always in the back of my mind), I’ve now decided to go the whole way and host this site myself, on my own hardware, in my own house!

I recently bought a Synology NAS to move all my files away from cloud storage as a default, and since then I have been looking to see what else I can do with it, since I noticed that most of the time, it really wasn’t doing much at all (apart from nightly backups and the occasional file access).

On a separate note (and maybe the subject of another blog post), I first installed Home Assistant and Homebridge to move away from an ageing Raspberry Pi for my smart home appliances. I still had some spare capacity, so I decided that it would be a fun little project to host my own website on it (since it doesn’t need any kind of database or scripting language).

Here’s how I did it.

## Get a separate IP address

I’m hosting this website from my home broadband connection which is provided by [A&A](https://www.aa.net.uk). They are amazing and very technically-minded, so they are more than happy for customers to host services from their home connections, even mail servers which most ISPs would baulk at (and block). But I didn’t want to use the static IP address they assign for this connection.

As well as this default static IP address, A&A are also happy, on request, to provide a `/29` block, which gives you 6 usable IP addresses. So I requested one of these so that I could use a separate IP address for the website.

## Add the new IP addresses to the router

In order to use these new IP addresses, my router first needed to be aware of them. I use an Ubiquiti Dream Machine Pro which is a gateway appliance, so I logged into the management site at <https://unifi.ui.com>. In Network &rarr; Settings &rarr; Internet &rarr; Primary (WAN1), under the IPv4 configuration, I added each IP address in “additional IP addresses”. Note that each IP address, although it needs to be added individually, still needs the `/29` suffix.

<figure>
  <picture>
    <source srcset="/images/blog/add-ip-address-to-router.webp" type="image/webp">
    <img src="/images/blog/add-ip-address-to-router.png" alt="Adding the new IP addresses in the UniFi console">
  </picture>
  <figcaption>Adding the new IP addresses in the UniFi console</figcaption>
</figure>

## Set up the NAS

I’m using my existing Synology NAS to host the website, so next up, I needed to set up the web server. I logged into the management console, went to Package Manager, and installed Web Station and Apache HTTP Server.

Next up, I opened Web Station. I started by creating a new Web Service, choosing a static site followed by a document root separate from my other shares, and choosing Apache HTTP Server as the backend server.

Finally, I created a Web Portal, choosing my just-created service, making it port-based, and choosing port 8080. This keeps the usual port 80 open for the Synology’s own console and also makes it much easier to forward my dedicated IP address to that port.

<figure>
  <picture>
    <source srcset="/images/blog/set-up-the-nas.webp" type="image/webp">
    <img src="/images/blog/set-up-the-nas.png" alt="Setting up the static website in Synology DSM">
  </picture>
  <figcaption>Setting up the static website in Synology DSM</figcaption>
</figure>

<figure>
  <picture>
    <source srcset="/images/blog/set-up-the-nas-2.webp" type="image/webp">
    <img src="/images/blog/set-up-the-nas-2.png" alt="Setting up the web portal in Synology DSM">
  </picture>
  <figcaption>Setting up the web portal in Synology DSM</figcaption>
</figure>

## Add port forwarding rules

At the moment, we can access our new website internally via the IP address of the Synology NAS and the port 8080 that we just assigned, for example, <http://192.168.1.10:8080> (this will show the Synology’s default 404 page for the moment). However, to be able to access the website from outside our local network, we need to forward some ports on the Ubiquiti Dream Machine Pro to the Synology NAS.

I added some rules in Network &rarr; Settings &rarr; Routing &rarr; Port Forwarding to essentially forward any traffic to port 80 of my new WAN IP address to port 8080 of the Synology’s internal IP address.

In the simple case, this can just be a single rule, but I wanted to have a CDN in front of my website for a number of reasons, and I don’t want external people to be able to access the website directly. I’m using Fastly, so I got a list of their public IP addresses from <https://api.fastly.com/public-ip-list>, and made a rule for each one, allowing that IP address to access port 80 of the WAN IP address and be forwarded to port 8080 of the Synology NAS.

This means that if anyone tries to access the WAN IP address, it’ll just time out, but Fastly will get a reply that they can then cache.

<figure>
  <picture>
    <source srcset="/images/blog/add-port-forwarding-rules.webp" type="image/webp">
    <img src="/images/blog/add-port-forwarding-rules.png" alt="Setting up port forwarding rules in the UniFi console">
  </picture>
  <figcaption>Setting up port forwarding rules in the UniFi console</figcaption>
</figure>

## Add the DNS entry for the origin

Now’s the time to add the DNS entry for the origin (basically the IP address that is being port-forwarded to the Synology NAS). I went to the DNS management page for wackomenace.co.uk and added a `CNAME` entry for `www-origin.wackomenace.co.uk` pointed at the IP address. This is what Fastly will use, which also allows me to change the IP address without having to change anything in Fastly itself.

## Set up Fastly

Time to set up Fastly. I signed up for a new account, and then [added a new service](https://manage.fastly.com/configure) for `wackomenace` with the domains `wackomenace.co.uk` and `www.wackomenace.co.uk`.

I added `www-origin.wackomenace.co.uk` as a host and made sure to disable TLS. I want all TLS, certificates etc to be handled and terminated by Fastly, since it’s a bit of a pain to set this up on the Synology NAS and keep it updated.

I enabled serving stale content (so that if the Synology NAS goes down for any reason, the website will still be up), HTTP/3 and compression, and set up an apex redirect from `wackomenace.co.uk` to `www.wackomenace.co.uk`. I also disabled forcing TLS since I want my website to be accessible from old devices, but this is a niche requirement and you may well do better to keep it on.

Finally, I went to [TLS management](https://manage.fastly.com/network/domains) and created Fastly-managed Let’s Encrypt certificates for both domains.

## Enable dual-stack hosting for the apex domain

Fastly allows you to point your domain to them using either IPv4-only or dual-stack configurations. Naturally, I wanted to go dual-stack for everything, but for some reason, they don’t enable dual-stack by default for apex domains. I created a ticket and asked for this to be enabled, which was done within a couple of hours.

I then went to the [TLS configurations page](https://manage.fastly.com/network/tls-configurations) which lists the hostnames and IP addresses to use. I created a `CNAME` for `www.wackomenace.co.uk` and `A` and `AAAA` records for `wackomenace.co.uk` using the records listed for “HTTP/3 & TLS v1.3 + 0RTT”.

## Done!

That’s it. I just had to wait for the DNS to propagate, but in the meantime, I visited `http://www.wackomenace.co.uk.global.prod.fastly.net` to make sure all the configuration was working as expected. This method works for any domain that you add to Fastly appended with `global.prod.fastly.net`.
