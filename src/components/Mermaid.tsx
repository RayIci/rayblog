import { useEffect, useRef, useState } from "react";

interface Props {
  code: string;
  width?: string;
  maxWidth?: string;
}

export function Mermaid({ code, width, maxWidth }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const mermaid = (await import("mermaid")).default;
      const isDark = document.documentElement.classList.contains("dark");

      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "default",
      });

      const id = `mermaid-${Math.random().toString(36).slice(2)}`;
      const { svg: rendered } = await mermaid.render(id, code.trim());
      if (!cancelled) setSvg(rendered);
    }

    render();

    // Re-render on theme change
    const observer = new MutationObserver(render);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [code]);

  if (!svg) {
    return (
      <div
        className="bg-muted/40 my-6 mx-auto flex h-32 items-center justify-center rounded-xl"
        style={{ width, maxWidth }}
      >
        <span className="text-muted-foreground text-sm">Loading diagram…</span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="not-prose my-6 mx-auto flex justify-center overflow-x-auto rounded-xl"
      style={{ width, maxWidth }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
