import { getCollection } from "astro:content";
import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "@vercel/og";

export async function GET({ params }) {
  const { slug } = params;
  const essays = await getCollection("essays");
  const essay = essays.find((essay) => essay.id === slug);
  if (!essay) return new Response(null, { status: 404, statusText: "Not Found" });

  const Logo = fs.readFileSync(path.resolve("./public/images/logo.png"));
  const IBMPlexSerifBold = fs.readFileSync(path.resolve("./src/assets/fonts/IBMPlexSerif-SemiBold.woff"));
  const IBMPlexSansRegular = fs.readFileSync(path.resolve("./src/assets/fonts/IBMPlexSans-Regular.woff"));

  const html = {
    type: "div",
    props: {
      children: [
        {
          type: "div",
          props: {
            tw: "w-[111px] h-[111px] flex",
            children: [
              {
                type: "img",
                props: {
                  src: Logo.buffer
                }
              }
            ]
          }
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
                    fontFamily: "IBM Plex Serif Bold"
                  },
                  children: essay.data.title
                }
              }
            ]
          }
        },
        {
          type: "div",
          props: {
            tw: "absolute right-[40px] bottom-[40px] flex items-center",
            children: [
              {
                type: "div",
                props: {
                  tw: "text-3xl text-slate-600",
                  children: "www.wackomenace.co.uk"
                }
              }
            ]
          }
        }
      ],
      tw: "w-full h-full flex items-center justify-center relative px-22",
      style: {
        background: "#ffefef",
        fontFamily: "IBM Plex Sans Regular"
      }
    }
  };

  return new ImageResponse(html, {
    width: 1200,
    height: 600,
    fonts: [
      {
        name: "IBM Plex Serif Bold",
        data: IBMPlexSerifBold.buffer,
        style: "normal"
      },
      {
        name: "IBM Plex Sans Regular",
        data: IBMPlexSansRegular.buffer,
        style: "normal"
      }
    ]
  });
}
