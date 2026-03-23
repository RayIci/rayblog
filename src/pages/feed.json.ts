import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog", ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  const sorted = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const site = context.site!.toString().replace(/\/$/, "");

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "RayBlog",
    description: "Personal notes & engineering writing",
    home_page_url: `${site}/`,
    feed_url: `${site}/feed.json`,
    language: "en-US",
    items: sorted.map((post) => ({
      id: `${site}/blog/${post.id}/`,
      url: `${site}/blog/${post.id}/`,
      title: post.data.title,
      summary: post.data.description,
      date_published: post.data.pubDate.toISOString(),
      ...(post.data.updatedDate && {
        date_modified: post.data.updatedDate.toISOString(),
      }),
      tags: post.data.tags ?? [],
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
    },
  });
}
