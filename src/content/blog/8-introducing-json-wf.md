---
title: Introducing JSON-WF
date: 2024-04-23
excerpt: A new JSON-based format for sharing blogrolls.
---

> **Update (09/01/2025):** This post is now of historic interest only since the JSON-WF format has been deprecated.

When I was perusing what is now known as Web 1.0, it was the heyday of personal blogs, and linking to your blogging friends was all the rage. As well as burnishing your own credentials as a top-dog blogger if you linked to and were linked to from other top-dog bloggers, it also provided a way for readers to expand their own list of blogs to read.

So called blogrolls were provided as an HTML list, but also increasingly in OPML format, which allowed them to be imported wholesale into feed readers. OPML was invented in the early 2000s primarily as a file format for outliners, but due to its use in Radio UserLand, it became the de-facto standard for sharing blogrolls.

With the rise of the indie web, aiming to recreate some of that Web 1.0 magic with blogs, blogrolls, webrings and more, OPML-based blogrolls have once again become a more common sight.

Unfortunately, in my opinion, OPML is not the best format for this task.

Firstly, it is much-too complex for simple link sharing. As primarily an outlining format, it supports multi-level nesting, HTML embedding and many other features that are not required for blogrolls.

Secondly, as a product of the early 2000s, it is an XML-based format which itself is more cumbersome for parsing. Due to XML being vastly more complex than JSON, XML parsers are less plentiful, larger and slower than JSON parsers. Most APIs and other automated methods of consuming data nowadays expect JSON.

So with that preamble, and seeing nothing else available, I decided to create a new format for JSON-based blogroll sharing: JSON-WF.

JSON-WF (JSON for web feeds) is a purpose-built format just for blogroll sharing and nothing else. It is also JSON-based. Those two attributes make it much simpler to understand and parse than OPML.

As with all new formats, it will take a while for existing feed readers and bloggers to embrace this new format and support it, and of course it may never happen. Maybe OPML is simply good enough and there is too much inertia. But given that you never know until you launch, JSON-WF is here and ready for adoption.

In the spirit of kicking things off, I’ve also added a JSON-WF blogroll alongside my existing OPML one for my own [blogroll](/blogroll/).

If you’re a blogger or developer of a feed reader, please consider adding support for JSON-WF blogrolls and spread the word!
