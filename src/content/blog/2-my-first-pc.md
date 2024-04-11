---
title: Recreating my first PC
date: 2024-03-10
excerpt: Looking back with fondness at my first Windows desktop.
tags: [retro, pc]
cover: ./images/packard-bell-pulsar-33.jpg
---

Recently, I read Lothar Serra Mari’s article on [recreating his first PC](https://fabulous.systems/posts/2022/12/virtual-archaeology-recreating-my-first-computer/) and it got me thinking. He had a Packard Bell, which was also my first PC when I was 10 years old.

Unfortunately, I got rid of that PC a few years ago. So I thought to myself, why not try to at least recreate it in a virtual machine, taking inspiration (and a lot of steps) from that article?

Probably the hardest part was finding the correct Master CD for the system I was attempting to recreate. For the uninitiated, Master CDs were Packard Bell’s method of distributing Windows and bundled software for multiple PC models on a single CD, where the actual installation was determined by data held in hidden sectors of the pre-installed hard drive (as well as the supplied boot floppy). There were a number of Master CDs produced across the years and regions of Packard Bell’s heyday.

Luckily for us, many users have uploaded copies of their Master CDs to the Internet Archive, so it was mainly a process of deducing which version I would have originally had (I had already narrowed the selection down to Master CDs produced for the European region with Windows 95 and that would have been available around 1997-1998).

Eventually, I found [this Master CD](https://archive.org/details/packard-bell-master-cd) which would have either been the exact one I had, or very close. It includes all the bundled software I remember being pre-installed. I downloaded the Torrent, and then converted the BIN/CUE files included into an ISO that I could mount.

Using DOSBox-X, I created a new Windows 95 VM using mostly the [recommended configuration](https://dosbox-x.com/wiki/Guide%3AInstalling-Windows-95), along with a virtual hard drive, then mounted the ISO as a CD in drive `D:` and a Windows 95 boot floppy image in drive `A:`.

I booted the VM from the boot floppy, then proceeded to partition and format the virtual hard drive as a FAT16 volume. I then shut it down, swapped the Windows 95 boot floppy for a Windows 98 one (which includes CD drivers) and booted up again[^1].

At this point, I was able to follow the steps from the article to manually expand the ARJ archives onto the virtual hard drive and kick-off the Windows 95 installation process. The actual Windows 95 installation proceeded pretty quickly, and most of the time was spent waiting for the custom Packard Bell bundles to be installed afterwards.

After what seemed like an eternity (and a few false starts), I was finally greeted with a sight that sent me right back to 1997 - the Packard Bell-customised Windows 95 desktop replete with all the bundled applications.

<figure>
  <img src="/images/blog/packard-bell-windows-95-in-dosbox-x.png" alt="Screenshot of a fresh installation of a Packard Bell-customised Windows 95 in DOSBox-X">
  <figcaption>Screenshot of a fresh installation of a Packard Bell-customised Windows 95 in DOSBox-X</figcaption>
</figure>

[^1]: I must note that at this point, I also mounted another, custom floppy image in drive `B:` that I created to include the `SMARTDRV` application from Windows 95. This application is not on any of the boot floppies but, as alluded to at the start of the Windows 95 installation, attempting to proceed without it (especially in a VM) is a recipe for an eternal wait. If you value your time, find a copy and run it right before you kick-off the archive expansion and installation processes.
