import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface Props {
  title: string;
}

export function ShareButton({ title }: Props) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const xUrl = `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleShare}
        className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
        aria-label="Share this post"
      >
        {copied ? (
          <>
            <Check className="size-3.5 text-emerald-500" />
            <span className="text-emerald-500">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="size-3.5" />
            <span>Copy link</span>
          </>
        )}
      </button>

      <span className="text-border">·</span>

      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        aria-label="Share on X"
      >
        𝕏
      </a>

      <span className="text-border">·</span>

      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        aria-label="Share on LinkedIn"
      >
        LinkedIn
      </a>
    </div>
  );
}
