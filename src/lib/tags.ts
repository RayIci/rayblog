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
  "security",
  "oauth",
] as const;

export type Tag = (typeof TAGS)[number];
