import { getCollection, type CollectionEntry } from "astro:content";
import fs from "fs";
import path from "path";
import { ImageResponse } from "@vercel/og";

interface Props {
  params: { slug: string };
  props: { post: CollectionEntry<"blog"> };
  site: URL;
}

export async function GET({ props, site }: Props) {
  const { post } = props;

  const RubenPhoto = fs.readFileSync(path.resolve("./assets/images/ruben.png"));
  const BackgroundImage = fs.readFileSync(path.resolve("./assets/images/bg.jpg"), "base64");
  const IbmPlexSansRegular = fs.readFileSync(path.resolve("./assets/fonts/IBMPlexSans-Regular.ttf"));
  const IbmPlexSansBold = fs.readFileSync(path.resolve("./assets/fonts/IBMPlexSans-Bold.ttf"));

  const html = {
    type: "div",
    props: {
      children: [
        {
          type: "div",
          props: {
            tw: "w-[200px] h-[200px] flex rounded-3xl overflow-hidden",
            children: [
              {
                type: "img",
                props: {
                  src: RubenPhoto.buffer,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            tw: "pl-10 shrink flex",
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "48px",
                    fontFamily: "IBM Plex Sans Bold",
                  },
                  children: post.data.title,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            tw: "absolute right-[40px] bottom-[40px] flex items-center",
            children: [
              {
                type: "div",
                props: {
                  tw: "text-3xl",
                  children: "www.wackomenace.co.uk",
                },
              },
            ],
          },
        },
      ],
      tw: "w-full h-full flex items-center justify-center relative px-22",
      style: {
        background: "#ffffff",
        //backgroundImage: `url(${site}images/bg.jpg)`,
        backgroundImage: `url(data:image/jpeg;base64,${BackgroundImage})`,
        fontFamily: "IBM Sans Regular",
      },
    },
  };

  return new ImageResponse(html, {
    width: 1200,
    height: 600,
    fonts: [
      {
        name: "IBM Plex Sans Bold",
        data: IbmPlexSansBold.buffer,
        style: "normal",
      },
      {
        name: "IBM Plex Sans Regular",
        data: IbmPlexSansRegular.buffer,
        style: "normal",
      },
    ],
  });
}

export async function getStaticPaths() {
  const blog = await getCollection("blog");
  return blog.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
