---
title: How to run Monica CRM in Docker with Caddy
date: 2024-07-30
excerpt: Use Caddy to proxy requests to PHP-FPM in Docker containers.
tags: [server, docker, caddy, monica-crm]
---

[Monica](https://www.monicahq.com) is a CRM-style app for managing your personal relationships. It’s a hosted service that can also be self-hosted thanks to the open source code on GitHub.

I’m in the process of moving my website to a VPS from Cloudflare Pages (which I’ll go into in a subsequent post), and as part of this move, I’m using [Caddy](https://caddyserver.com) as the web server, installed locally and proxying to Docker containers for each website. I also wanted to install Monica as another container to be proxied by Caddy. Unfortunately, there’s a real dearth of information about this setup.

So, if you’re interested in a similar setup (or generally proxying from a local Caddy to PHP-FPM in a Docker container), here’s what I did.

Start off with a Docker Compose file (`docker-compose.yml`) to build and run the Monica and MySQL/MariaDB containers:

```yaml
name: monica

services:
  app:
    image: monica:fpm
    environment:
      - APP_ENV=production
      - APP_KEY=base64:abcd
      - DB_HOST=db
      - DB_USERNAME=monica
      - DB_PASSWORD=secret
    ports:
      - "9000:9000"
    depends_on:
      - db
    volumes:
      - data:/var/www/html/storage
      - static:/var/www/html/public
    restart: always

  db:
    image: mariadb:11
    environment:
      - MYSQL_RANDOM_ROOT_PASSWORD=true
      - MYSQL_DATABASE=monica
      - MYSQL_USER=monica
      - MYSQL_PASSWORD=secret
    volumes:
      - mysql:/var/lib/mysql
    restart: always

volumes:
  data:
    name: data
  static:
    name: static
  mysql:
    name: mysql
```

This is adapted from the official setup for running a PHP-FPM version of Monica, but with the `nginx` proxy-related parts removed. I also exposed port 9000 from the `app` container which is what Caddy will proxy to. Finally, I added a second volume to the `app` container named `static` that exposes the `/var/www/html/public` folder. The relevance of this will become clearer later.

Then there’s the `Caddyfile` that configures Caddy. Here’s the relevant snippet:

```
monica.wackomenace.co.uk {
  root * /srv/monica.wackomenace.co.uk/public
  php_fastcgi localhost:9000 {
    root /var/www/html/public
  }
  file_server
}
```

`/srv/monica.wackomenace.co.uk` is the folder that contains the `docker-compose.yml` file from earlier. I set the web root to `public` inside that folder.

Then all PHP requests are proxied to port 9000 (which I exposed earlier), and I set another web root - this is the folder inside the Monica container that contains files to be served by the web server. This is important because otherwise, Caddy will attempt to proxy requests to the container using `/srv/monica.wackomenace.co.uk/public` as the path prefix, which obviously won’t work.

Finally, I declared `file_server` which means anything that isn’t proxied (i.e. all non-PHP files) will be served statically from the root folder. This is where `/srv/monica.wackomenace.co.uk/public` and the `static` volume of the container come into play.

I need to serve static files (e.g. CSS or JS files) directly from Caddy, and only proxy PHP requests to the Monica container. To do this, I essentially need to share the public web root (`/var/www/html/public` in the container, which contains these files) with the host machine (which has the Caddy installation), ideally without maintaining two separate Monica installations (with the local one only being used for static files).

The `static` volume in the Docker Compose file makes the contents of the `/var/www/html/public` folder in the container available to the host machine at the path `/var/lib/docker/volumes/static/_data`. This is good, but that path is owned by `root` and therefore not accessible to Caddy.

To get around this limitation, I used `bindfs` to effectively mount a read-only copy of that folder at `/srv/monica.wackomenace.co.uk/public` (the web root I defined earlier) owned by the Caddy user. This allows Caddy to serve static files from this folder, and for the contents to always be in sync whenever I update the Monica container. An entry in `/etc/fstab` makes this configuration survive across reboots:

```
/var/lib/docker/volumes/static/_data /srv/monica.wackomenace.co.uk/public fuse.bindfs force-user=caddy,force-group=caddy,perms=0000:u+rD 0 0
```

With all that, I now have a working self-hosted Monica installation that uses my existing infrastructure and can be kept up-to-date easily.
