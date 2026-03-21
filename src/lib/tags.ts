export const TAGS = [
  "meta",
  "intro",
  "astro",
  "react",
  "typescript",
  "tooling",
  "open-source",
  "writing",
] as const;

export type Tag = (typeof TAGS)[number];
