export const TAGS = [
  "meta",
  "astro",
  "writing",
  "architecture",
  "backend",
  "dotnet",
  "pattern",
  "authentication",
  "authorization",
] as const;

export type Tag = (typeof TAGS)[number];
