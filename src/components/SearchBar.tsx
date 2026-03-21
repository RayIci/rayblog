import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  isActive: boolean;
  query: string;
  onChange: (q: string) => void;
  onFocus: () => void;
  onClose: () => void;
}

export function SearchBar({
  isActive,
  query,
  onChange,
  onFocus,
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
      {/* Compact desktop input — always in flex flow on md+, acts as a trigger */}
      <motion.div
        className="relative hidden flex-1 cursor-pointer items-center md:flex"
        animate={{ opacity: isActive ? 0 : 1 }}
        transition={{ duration: 0.15 }}
        style={{ pointerEvents: isActive ? "none" : "auto" }}
        onClick={onFocus}
      >
        <Search className="text-muted-foreground pointer-events-none absolute left-2.5 size-3.5" />
        <div className="bg-muted/50 text-muted-foreground/60 hover:bg-muted/80 w-full rounded-lg py-1.5 pr-3 pl-8 text-sm transition-colors">
          Search posts…
        </div>
      </motion.div>

      {/* Active overlay — covers full nav when search is open */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-background/90 absolute inset-0 z-20 flex items-center gap-3 rounded-2xl px-4"
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
