import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  isActive: boolean;
  query: string;
  onChange: (q: string) => void;
  onClose: () => void;
}

export function SearchBar({
  isActive,
  query,
  onChange,
  onClose,
}: SearchBarProps) {
  const overlayInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive) {
      overlayInputRef.current?.focus();
    }
  }, [isActive]);

  return (
    <>
      {/* Active overlay — covers full nav when search is open */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-background/95 absolute inset-0 z-20 flex items-center gap-3 rounded-xl px-4"
          >
            <Search className="text-muted-foreground size-4 shrink-0" />
            <input
              ref={overlayInputRef}
              type="text"
              placeholder="Search posts…"
              value={query}
              onChange={(e) => onChange(e.target.value)}
              className="placeholder:text-muted-foreground/60 flex-1 bg-transparent text-sm outline-none"
            />
            <button
              onClick={onClose}
              aria-label="Close search"
              className="text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-md p-1 transition-colors"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
