export const TAGS = [
  "meta",
  "astro",
  "writing",
  "architecture",
  "backend",
  "dotnet",
  "pattern",
] as const;

export type Tag = (typeof TAGS)[number];
