---
title: Deploying an Astro site to Synology
date: 2025-02-17
excerpt: A quick writeup on how I deploy my static Astro site to my Synology NAS.
---

In the [last blog post](/blog/23-moving-to-local-hosting/), I went through the process of moving the hosting of this site to my Synology NAS, fronted by Fastly for speed, resilience and security. Now it’s time to deploy the site, which is built with Astro, to the Synology NAS.

I started by removing the previous GitHub Action which deployed to my shared hosting since that’s no longer applicable. Since I didn’t to open my Synology NAS’ SSH ports to the Internet for deployment, I decided to make it a completely local process.

I added a new, simple script, `deploy.sh`, which contains:

```
#!/usr/bin/env bash
npm install
npm run build
rsync -rtv ./dist/ /Users/rubenarakelyan/SynologyDrive/wackomenace.co.uk/
rm -rf ./dist/
```

The `SynologyDrive` folder is maintained by the Synology Drive app, which I have installed on my Mac and which acts like OneDrive or Google Drive, keeping a local folder in-sync with its counterpart on the Synology NAS. This also means I can use that folder as a target and have Synology Drive handle the complications of syncing my changes, which makes them live.

I simply run Astro’s build process, which places the output files into the `dist` folder, copy the entire contents of that folder to the one managed by Synology Drive using `rsync`, then remove the local copy. Synology Drive syncs changes to the Synology NAS within a couple of seconds, and everything is live! The entire process generally takes less than 10 seconds since it all runs locally.
