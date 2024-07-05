import { getCollection, type CollectionEntry } from "astro:content";
import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "@vercel/og";

interface Props {
  params: { slug: string };
  props: { post: CollectionEntry<"blog"> };
}

export async function GET({ props }: Props) {
  const { post } = props;

  const RubenPhoto = fs.readFileSync(path.resolve("./assets/images/ruben.png"));
  const BackgroundImage = fs.readFileSync(path.resolve("./assets/images/bg.jpg"), "base64");
  const PpNeueMontrealRegular = fs.readFileSync(path.resolve("./assets/fonts/PPNeueMontreal-Book.ttf"));
  const PpNeueMontrealBold = fs.readFileSync(path.resolve("./assets/fonts/PPNeueMontreal-Bold.ttf"));

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
                    fontFamily: "PP Neue Montreal Bold",
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
        backgroundImage: `url(data:image/jpeg;base64,${BackgroundImage})`,
        fontFamily: "PP Neue Montreal Regular",
      },
    },
  };

  return new ImageResponse(html, {
    width: 1200,
    height: 600,
    fonts: [
      {
        name: "PP Neue Montreal Bold",
        data: PpNeueMontrealBold.buffer,
        style: "normal",
      },
      {
        name: "PP Neue Montreal Regular",
        data: PpNeueMontrealRegular.buffer,
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
