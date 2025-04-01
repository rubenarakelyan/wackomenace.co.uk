---
title: Backing up emails and code repositories
date: 2025-03-31
excerpt: I’ve been thinking more about the backups I have and how often I do them.
---

Backups are always the thing that comes last when thinking about data. Sure, I’ll get to that one day, after I’ve done all the other things I need to do. And even then, as the maxim goes, one backup is none backup.

So we start thinking about having multiple backups, maybe spread around different locations, how often we do them and how long we store them. This is all good thought, and something I do on a regular basis. However, thoughts always go towards our files - that is, document we create, photos we take or maybe things we download. I bet you most people don’t think of backing up their data from SaaS providers...

Do you use a password manager with a cloud service, like 1Password? Have you thought about what might happen if it goes down, maybe has a catastrophic data loss or is hacked? What about configurations for your devices at home, or your IoT hardware? What about your code repositories in GitHub?

I was thinking about this problem a few months ago, and decided it would be a good idea to take an inventory of the services where I have data that I could not afford to lose. I then set about working out how to back each one up.

## SaaS services and hardware config

For services like 1Password and all my home networking/automation/IoT hardware, it’s pretty simple - each one of them offers an export function, which I used to download a file with the data or configuration. I then saved this file into a Backups folder on my Synology NAS, which uses RAID for redundancy and also backs up offsite daily. This is the simple part.

## Emails

I use Fastmail for my emails, so I started looking at how to export all my emails, calendar events and contacts. For calendars and contacts, there are easy export functions that give you an ICS or VCF file. For emails, there is one option which will export up to 4GB of emails. If you have more than this, is might not work, and it’s also very inefficient to keep downloading the same emails each time.

Fastmail also came up with a protocol named JMAP to replace IMAP as a way for clients to communicate with the service. However, it’s also a very convenient way to write a small script that uses their JMAP API to search for and download all emails since the last backup. I wrote a small Ruby script called [backup-fastmail](https://github.com/rubenarakelyan/backup-fastmail) based on an existing Python one that does just this and is easy to use and configure. It’s not particularly clever (e.g. it doesn’t check to see if previously downloaded emails have been deleted) but it works and provides EML files for each email, complete with all headers and attachments.

## Code repositories

I use GitHub for all my source code repositories, and I know they have an API endpoint for pretty much any action you want to take. They also have an endpoint that generates a ZIP file of the latest state of a branch to download, which is perfect for my use-case.

So again, I wrote a small Ruby script called [backup-github](https://github.com/rubenarakelyan/backup-github) that backs up both repositories and Gists. For each, you get a ZIP file of the current state. It also keeps track of when these were downloaded so only changed repos and Gists are downloaded each time.

## Go forth and back up

Both scripts are licenced under the MIT license so please go ahead and use them, and if you can, improve them. I am waiting for the JMAP specification for calendars and contacts to be finalised so I can add these to the script and remove one more manual action. And don’t forget to back up early and back up often!
