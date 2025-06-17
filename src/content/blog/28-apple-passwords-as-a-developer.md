---
title: Apple Passwords as a developer
date: 2025-06-17
excerpt: How I moved to Apple Passwords as a heavy 1Password user.
---

As a web developer, I’m heavily invested in the password manager ecosystem. I preach the benefits of proper password management to anyone who’ll listen to me.

I’m also, however, growing increasingly tired of subscription-based software. Now, I don’t believe all subscriptions are bad per-se, but they need to meet a high bar for providing ongoing utility based on work from their developers.

Lately, I’ve been trying to cut down on these subscriptions. For example, I purchased a perpetual licence for Microsoft Office because I didn’t want to keep paying for Microsoft 365.

I had been eyeing-up 1Password as the next candidate, but I shared a family account with my wife and also used it for my business so there was some work to do to untie these knots.

I’m quite deep into the Apple ecosystem, but there was also the case with Apple Passwords being a shadow of 1Password feature-wise, so I had to decide what to do in each case.

## What I used 1Password for

I made a quick list of the types of information I was keeping in 1Password:

* Web logins (generally a username, password, 2FA code and one or more URLs they apply to)
* Standalone passwords (anything from an SSH key passkey to the code for a padlock)
* SSH keys
* Bank accounts
* Server details
* Wifi details
* Credit cards
* Software licences
* Driving licence/passport/other IDs
* Documents such as my will

That’s a lot of information to find a home for! Apple Passwords is really just for web logins, so this is what I did in each case.

## Standalone passwords, bank accounts, server and wifi details

I created a series of locked notes in Apple Notes within a folder system, each storing one piece of information. This information is rarely accessed, so storing it in Notes is fine.

## SSH keys

I exported all of these and moved them to my `~/.ssh` folder so I could continue to use SSH etc. I also backed them up to two separate USB keys in different places.

## Credit cards

I added these to Safari autofill so I can continue to use them on websites.

## Software licences

I created an Excel spreadsheet to store all of these in iCloud.

## IDs and documents

These are in the form of photos or scans. I moved these to iCloud.

## Web logins

This left web logins - the thing Apple Passwords is built for.

However, it doesn’t support extra fields and the import/export CSV format is even more limiting.

For each login, I went through and moved extra fields either into the notes field or to locked notes (if it was a recovery key for example). I also made sure all entries had at least one URL.

Then I exported everything into a CSV file which I imported into Apple Passwords. The first couple of times a few entries had errors, so I went back and corrected these before running the export/import again.

Finally, since the CSV only supports one URL, I went through entries with multiple URLs and manually added the extra ones.

## Work entries

I had a separate vault in 1Password with work-related entries. I merged these into my main vault with a separate naming convention to keep things organised.

## Family

My wife had also started to use 1Password, but with much fewer entries. Since her requirements are much simpler, I opted to move her data to a standalone Proton Pass account with the apps and extensions as required. This kept everything she needed and disconnected her from the family account.

With that, I was finally done. My last act was to sign in to 1Password one last time and delete my account, finally freeing myself of one more payment.
