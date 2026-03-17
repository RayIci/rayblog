export const TAGS = ["meta", "intro", "astro", "react", "typescript"] as const;

export type Tag = (typeof TAGS)[number];
