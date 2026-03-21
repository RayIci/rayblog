// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import expressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://rayblog.vercel.app",
  integrations: [
    react(),
    expressiveCode({
      themes: ["catppuccin-mocha", "catppuccin-latte"],
      styleOverrides: { borderRadius: "0.625rem" },
      plugins: [pluginLineNumbers()],
      defaultProps: /** @type {any} */ ({ showLineNumbers: true }),
    }),
    mdx(),
    sitemap(),
  ],

  markdown: {
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});
