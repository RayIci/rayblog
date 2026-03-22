import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export function GiscusComments() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="pt-2">
      <Giscus
        repo="RayIci/rayblog"
        repoId="REPLACE_WITH_REPO_ID"
        category="Announcements"
        categoryId="REPLACE_WITH_CATEGORY_ID"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
