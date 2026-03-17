# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use `bun` as the package manager (not npm/yarn).

```bash
bun run dev       # Start dev server with hot reload
bun run build     # Build for production
bun run preview   # Preview the production build
```

There are no test or lint scripts configured.

## Architecture

**RayBlog** is a personal knowledge base and blog built with Astro, deployed to Vercel.

### Stack

- **Astro 6** — static site generator; pages live in `src/pages/`, with `[...slug].astro` for dynamic blog routes
- **React 19** — used only for interactive components (theme toggle); Astro components handle everything else
- **Tailwind CSS 4** — configured via CSS `@theme` directives in `src/styles/global.css` (no `tailwind.config.js`)
- **shadcn/ui** — component library; add components via `bunx shadcn add <component>`
- **MDX** — blog content lives in `src/content/blog/` as `.mdx` files

### Content System

Blog posts use Astro Content Collections. The schema is defined in `src/content.config.ts`:

- Required: `title`, `pubDate`
- Optional: `description`, `updatedDate`, `tags` (array), `draft` (boolean, defaults false)

Draft posts are filtered out in production. The home page (`src/pages/index.astro`) shows the 5 most recent posts; the blog index (`src/pages/blog/index.astro`) shows all with tag filtering.

### Theming

Dark/light mode is handled by `next-themes`. `ThemeProvider.tsx` wraps the app (in `BaseLayout.astro`), and `ThemeToggle.tsx` is the toggle button in the header. CSS variables for both themes are defined in `global.css` using OkLCh color space.

### Path Aliases

`@/*` maps to `src/*` — use `@/components/...`, `@/lib/...`, etc.

### Layouts

- `BaseLayout.astro` — wraps every page; includes header, footer, theme provider, global CSS
- `BlogPostLayout.astro` — extends BaseLayout; renders MDX content with `@tailwindcss/typography` prose styles
