---
title: Building a guestbook with Astro and Cloudflare Pages
date: 2024-04-08
excerpt: Here’s how I built a simple guestbook for my website using Astro and hosting on Cloudflare Pages.
---

So far, my website has been a simple, static affair, built on deployment and hosted on Cloudflare Pages. However, I always knew that once I had the main site up and running as I wanted, I would start adding a little dynamic functionality since a purely static site is somewhat limiting.

I wanted to start with something small and non-critical, and a guestbook happened to be the perfect candidate. I remembered reading about [Kev Quirk’s guestbook](https://kevquirk.com/guestbook) and wanting to have one of my own.

Here are the steps and code I used to build my guestbook:

## Make sure your site is set up for dynamic pages

First thing’s first - this won’t work on a purely static Astro site, so open `astro.config.mjs` and make sure the `output` is set to either `hybrid` or `server`.

```javascript
export default defineConfig({
  output: "hybrid", // or "server"
  ...
});
```

I have mine set to `hybrid` since the vast majority of my site is static, so pages can be built once and served quickly.

## Choose and set up a database

You’ll need some kind of database to store guestbook submissions. If you’re hosting on Cloudflare Pages, you could use their D1 database service which has a generous free plan.

For simplicity, however, I decided to go with Astro’s own Astro Studio service which includes hosted databases for your Astro sites, and so far seems to be completely free (there is mention of billing and the chance to enter your credit card details, but no mention of pricing or plans).

The beauty of Astro Studio is that it is very quick and simple to set up.

Visit <https://studio.astro.build/> and proceed to create an account linked to your GitHub account. Then, choose the repository that contains your Astro site. Astro Studio will commit a GitHub Action which is triggered on all pushes and Pull Requests, and which updates your database in Astro Studio based on the latest schema.

Back in your code, in your `package.json`, edit the `build` script with `--remote` to connect to Astro Studio during the build phase, like so:

```javascript
"scripts": {
  ...
  "build": "astro check && astro build --remote",
  ...
},
```

Then, run `npx astro add db` to install the database integration and create some stub files. These are `db/config.ts` and `db/seed.ts`. We’re mainly interested in `config.ts`, where you define your database schema. Here’s mine:

```javascript
import { defineDb, defineTable, column, NOW } from "astro:db";

const GuestbookEntries = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    email: column.text({ optional: true }),
    website: column.text({ optional: true }),
    message: column.text(),
    created_at: column.date({ default: NOW }),
    approved_at: column.date({ optional: true }),
  }
});

export default defineDb({
  tables: { GuestbookEntries }
});
```

It’s one table called `GuestbookEntries` that has some simple columns including an ID primary key, mandatory and optional columns and one with a default value.

<figure>
  <img src="/images/blog/astro-studio.png" alt="Screenshot of the GuestbookEntries database in Astro Studio">
  <figcaption>Screenshot of the GuestbookEntries database in Astro Studio</figcaption>
</figure>

## Create your guestbook page

Now we come to the real work - creating the page that will display our guestbook with its entries and allow users to sign it by submitting a few details. I’ll provide the final code here then step through it below. I named it `guestbook.astro` and placed it in `pages` so it’s accessible as `/guestbook` on my site.

```
---
export const prerender = false;

import { db, isNotNull, GuestbookEntries } from "astro:db";

const errors = { name: "", message: "" };

if (Astro.request.method === "POST") {
  try {
    const formData = await Astro.request.formData();
    const name = (formData.get("name") as String).trim();
    const email = (formData.get("email") as String).trim() || null;
    const website = (formData.get("website") as String).trim() || null;
    const message = (formData.get("message") as String).trim();
    if (typeof name !== "string" || name.length < 1) {
      errors.name = "Enter a name";
    }
    if (typeof message !== "string" || message.length < 1) {
      errors.message = "Enter a message";
    }
    const hasErrors = Object.values(errors).some(msg => msg);
    if (!hasErrors) {
      await db.insert(GuestbookEntries).values({ name, email, website, message });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}

import Layout from "../layouts/Layout.astro";
import GuestbookEntry from "../components/GuestbookEntry.astro";

const guestbook_entries = await db.select().from(GuestbookEntries).where(isNotNull(GuestbookEntries.approved_at));
---

<Layout title="Guestbook" description="Sign my guestbook if you enjoyed visiting my website.">
  <div>
    <h1 class="text-4xl mb-6">Guestbook</h1>
    <p class="mb-6">Taking inspiration from <a href="https://kevquirk.com/guestbook" target="_blank" rel="noopener noreferer">Kev Quirk’s guestbook</a>, here’s my take on it. Pretty simple - if you like my website and would like to leave a message, sign my guestbook using the form below.</p>
    <p class="mb-6">Note, your message will be moderated before being shown.</p>
    <p class="mb-6">
      <a class="no-underline px-4 py-2 border rounded-md border-slate-600 bg-slate-600 dark:border-slate-200 dark:bg-slate-200 text-white dark:text-slate-600 hover:border-slate-900 hover:bg-slate-900 hover:text-white dark:hover:border-slate-500 dark:hover:bg-slate-500 transition duration-300 ease-in-out" href="#sign-guestbook">Sign my guestbook &darr;</a>
    </p>
    <hr class="mb-6">
    {
      guestbook_entries.map((entry) => (
        <GuestbookEntry
          name={entry.name}
          email={entry.email}
          website={entry.website}
          message={entry.message}
          created_at={entry.created_at}
        />
      ))
    }
    <form method="post">
      <h2 class="text-3xl mb-6" id="sign-guestbook">Sign my guestbook</h2>
      <p class="mb-6 text-sm">Your name and a message are required; everything else is optional. If you provide your email address, it will be used to show your <a href="https://gravatar.com" target="_blank" rel="noopener noreferer">Gravatar</a> (if you have one) but will not be disclosed.</p>
      <label class="block mb-4">
        <span class="block text-sm font-medium">Name</span>
        <input type="text" name="name" class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 peer" required>
        {errors.name && <p class="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">{errors.name}</p>}
      </label>
      <label class="block mb-4">
        <span class="block text-sm font-medium">Email address (optional)</span>
        <input type="email" name="email" class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500">
      </label>
      <label class="block mb-4">
        <span class="block text-sm font-medium">Website (optional)</span>
        <input type="url" name="website" class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500">
      </label>
      <label class="block mb-4">
        <span class="block text-sm font-medium">Message</span>
        <textarea name="message" class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 peer" required></textarea>
        {errors.message && <p class="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">{errors.message}</p>}
      </label>
      <button type="submit" class="px-4 py-2 border rounded-md border-slate-600 bg-slate-600 dark:border-slate-200 dark:bg-slate-200 text-white dark:text-slate-600 hover:border-slate-900 hover:bg-slate-900 hover:text-white dark:hover:border-slate-500 dark:hover:bg-slate-500 transition duration-300 ease-in-out">Submit</button>
    </form>
  </div>
</Layout>
```

There’s a lot going on, so let’s see what’s happening, starting with the frontmatter.

`export const prerender = false;` tells Astro that this page is dynamic and should not be rendered at build time.

The block starting with `if (Astro.request.method === "POST") {` is where the real work is done. This is run if the guestbook page receives a `POST` request, which is what happens when the form is submitted. The code mainly validates the data received, and if all is well, inserts it in the database with `await db.insert(GuestbookEntries).values({ name, email, website, message });`.

Finally, `const guestbook_entries = await db.select().from(GuestbookEntries).where(isNotNull(GuestbookEntries.approved_at));` gets all the existing guestbook entries from the database that have an `approved_at` date.

The rest of the frontend code mostly renders the existing entries and a form to allow for new entries.

Now let’s take a look at the `GuestbookEntry` component:

```
---
import { Image } from "astro:assets";

import FormattedDate from "./FormattedDate.astro";

interface Props {
  name: string;
  email: string | null;
  website: string | null;
  message: string;
  created_at: Date;
}

const hashed_email = Astro.props.email == null ? "0" : Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(Astro.props.email.trim().toLowerCase())))).map((b) => b.toString(16).padStart(2, "0")).join("");
const { name, website, message, created_at } = Astro.props;
---

<article class="mb-6">
  <p class="mb-6 mr-6 float-left">
    <Image src=`https://gravatar.com/avatar/${hashed_email}?d=mp` width="80" height="80" alt="" />
  </p>
  <p>
    {website && <a href={website} target="_blank" rel="noopener noreferer nofollow ugc">{name}</a>}
    {!website && name}
  </p>
  <p class="text-sm">
    <FormattedDate date={created_at} />
  </p>
  <p class="mb-6 clear-left whitespace-pre-line">
    {message}
  </p>
  <hr>
</article>
```

Again, most of it should be self-explanatory.

`hashed_email` is of some interest here - it takes an optional email address and creates a SHA-256 digest of it to pass to Gravatar. By setting the digest to `0` if there is no email address along with `?d=mp` in the URL, we ensure we always have an avatar to show, even if it’s just the anonymous silhouette.

The fact that we need to tie ourselves in knots just to create a SHA-256 digest from a string says a lot about JavaScript - why not just `"some_string".toDigest("SHA-256")` or something similar? Node.js does come with a `crypto` library that makes it a lot simpler, but Cloudflare Pages doesn’t support Node.js so we need to stick to vanilla JavaScript methods here.

The other thing to note is that if a user provides a website address, we use it to link their name. Since this is user-provided data which cannot be trusted, we also set the `nofollow` and `ugc` (user-generated content) values on the `rel` attribute of the link to hint to search engines that the link should not be followed or inherit any of our site’s ranking. This is to protect us from malicious users who try to use the guestbook to boost their own rankings, especially so if the linked-to sites are unsavoury.

## Moderate entries

You may have noticed that along with the usual columns, we also have an optional `approved_at` column. This is a simple moderation control that ensures that no entries are shown on your guestbook until you approve them. In our case, the act of moderation is simply to insert the current date and time into this column, and the presence of this data/time triggers the entry to be displayed. This should help you prevent the inevitable spam that comes with any submission form on the web.

You could also go down Kev Quirk’s route and add a simple human-check (like asking for the result of a simple maths sum), or even add a captcha to try to prevent some of the spam from being submitted in the first place. I may consider these features in the future if the situation gets bad.

To moderate entries, simply visit Astro Studio and view your database. Check any new entries that don't have an `approved_at` date and either add a date to show them, or delete them. Again, depending on traffic levels, I may revisit this in the future to add some kind of simple moderation dashboard to make this task easier.

## Let me know what you build

Have you found this guide useful? If you build a guestbook with Astro, let me know how you get on or what you’ve done differently or better.
