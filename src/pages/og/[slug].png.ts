import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import satori from "satori";

const interRegular = readFileSync(resolve("src/fonts/inter-400.ttf"));
const interBold = readFileSync(resolve("src/fonts/inter-700.ttf"));

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog", ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { title: post.data.title, tags: post.data.tags ?? [] },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, tags } = props as { title: string; tags: string[] };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element: any = {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0e0c14",
        padding: "60px 72px",
        fontFamily: "Inter",
        backgroundImage:
          "radial-gradient(ellipse 80% 60% at 110% 120%, #4c1d9533 0%, transparent 70%)",
      },
      children: [
        {
          type: "span",
          props: {
            style: {
              fontSize: 22,
              fontWeight: 600,
              color: "#c084fc",
              letterSpacing: "-0.02em",
            },
            children: "RayBlog",
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            },
            children: [
              {
                type: "h1",
                props: {
                  style: {
                    fontSize: title.length > 60 ? 42 : 56,
                    fontWeight: 700,
                    color: "#f5f3ff",
                    lineHeight: 1.15,
                    margin: 0,
                    letterSpacing: "-0.03em",
                  },
                  children: title,
                },
              },
              tags.length > 0
                ? {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                      },
                      children: tags.slice(0, 4).map((tag) => ({
                        type: "span",
                        props: {
                          style: {
                            fontSize: 16,
                            fontWeight: 500,
                            color: "#a78bfa",
                            backgroundColor: "#a78bfa1a",
                            border: "1px solid #a78bfa33",
                            borderRadius: "6px",
                            padding: "4px 12px",
                          },
                          children: tag,
                        },
                      })),
                    },
                  }
                : null,
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: interRegular, weight: 400, style: "normal" },
      { name: "Inter", data: interBold, weight: 700, style: "normal" },
    ],
  });

  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  })
    .render()
    .asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
