import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import Fuse from "fuse.js";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "@/components/SearchBar";
import { Badge } from "@/components/ui/badge";

export interface PostSearchData {
  id: string;
  title: string;
  description?: string;
  tags: string[];
}

interface HeaderProps {
  posts: PostSearchData[];
}

const FADE = { duration: 0.2, ease: "easeInOut" } as const;

export function Header({ posts }: HeaderProps) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PostSearchData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ["title", "description", "tags"],
        threshold: 0.4,
        minMatchCharLength: 2,
      }),
    [posts],
  );

  // Update results whenever query changes
  useEffect(() => {
    if (query.length >= 2) {
      setResults(fuse.search(query).map((r) => r.item));
    } else {
      setResults([]);
    }
  }, [query, fuse]);

  const handleClose = useCallback(() => {
    setIsSearchActive(false);
    setQuery("");
    setResults([]);
  }, []);

  const handleOpen = useCallback(() => {
    setIsSearchActive(true);
    setIsMobileMenuOpen(false);
  }, []);

  // Escape to close search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchActive) handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSearchActive, handleClose]);

  // Click outside to close search
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (
        isSearchActive &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isSearchActive, handleClose]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setIsMobileMenuOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const showResults = isSearchActive && query.length > 0;

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div ref={containerRef} className="mx-auto max-w-3xl">
        {/* Nav pill */}
        <nav className="border-border/40 bg-background/70 shadow-primary/5 relative flex h-12 items-center gap-2 rounded-2xl border px-4 shadow-lg backdrop-blur-xl">
          {/* Logo */}
          <motion.a
            href="/"
            animate={{ opacity: isSearchActive ? 0 : 1 }}
            transition={FADE}
            style={{ pointerEvents: isSearchActive ? "none" : "auto" }}
            className="hover:text-primary shrink-0 font-mono text-base font-semibold tracking-tight transition-colors"
          >
            RayBlog
          </motion.a>

          {/* Search bar — compact on desktop, overlay when active */}
          <SearchBar
            isActive={isSearchActive}
            query={query}
            onChange={setQuery}
            onFocus={handleOpen}
            onClose={handleClose}
          />

          {/* Desktop nav links */}
          <motion.div
            animate={{ opacity: isSearchActive ? 0 : 1 }}
            transition={FADE}
            style={{ pointerEvents: isSearchActive ? "none" : "auto" }}
            className="hidden shrink-0 items-center gap-1 md:flex"
          >
            <a
              href="/blog"
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg px-3 py-1.5 text-sm transition-colors"
            >
              Blog
            </a>
            <a
              href="/blog/tags"
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg px-3 py-1.5 text-sm transition-colors"
            >
              Tags
            </a>
          </motion.div>

          {/* Right group: theme toggle + mobile search icon + hamburger */}
          <motion.div
            animate={{ opacity: isSearchActive ? 0 : 1 }}
            transition={FADE}
            style={{ pointerEvents: isSearchActive ? "none" : "auto" }}
            className="ml-auto flex shrink-0 items-center gap-1 md:ml-0"
          >
            <ThemeToggle />

            {/* Mobile search icon */}
            <button
              onClick={handleOpen}
              aria-label="Search"
              className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-9 items-center justify-center rounded-lg transition-colors md:hidden"
            >
              <Search className="size-[18px]" />
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="text-muted-foreground hover:bg-muted hover:text-foreground relative flex size-9 items-center justify-center rounded-lg transition-colors md:hidden"
            >
              <motion.span
                animate={{
                  opacity: isMobileMenuOpen ? 0 : 1,
                  scale: isMobileMenuOpen ? 0.75 : 1,
                }}
                transition={{ duration: 0.15 }}
                className="absolute"
              >
                <Menu className="size-[18px]" />
              </motion.span>
              <motion.span
                animate={{
                  opacity: isMobileMenuOpen ? 1 : 0,
                  scale: isMobileMenuOpen ? 1 : 0.75,
                }}
                transition={{ duration: 0.15 }}
                className="absolute"
              >
                <X className="size-[18px]" />
              </motion.span>
            </button>
          </motion.div>
        </nav>

        {/* Search results panel */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="border-border/40 bg-background/90 shadow-primary/5 mt-2 overflow-hidden rounded-2xl border shadow-lg backdrop-blur-xl"
            >
              {query.length < 2 ? (
                <p className="text-muted-foreground px-4 py-8 text-center text-sm">
                  Keep typing…
                </p>
              ) : results.length === 0 ? (
                <p className="text-muted-foreground px-4 py-8 text-center text-sm">
                  No results for &ldquo;{query}&rdquo;
                </p>
              ) : (
                <ul>
                  {results.slice(0, 6).map((post, i) => (
                    <motion.li
                      key={post.id}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.15 }}
                    >
                      <a
                        href={`/blog/${post.id}`}
                        onClick={handleClose}
                        className="hover:bg-muted/60 group flex flex-col gap-1 px-4 py-3 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="group-hover:text-primary line-clamp-1 text-sm font-semibold transition-colors">
                            {post.title}
                          </span>
                          {post.tags.length > 0 && (
                            <div className="flex shrink-0 gap-1">
                              {post.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        {post.description && (
                          <p className="text-muted-foreground line-clamp-1 text-xs">
                            {post.description}
                          </p>
                        )}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {isMobileMenuOpen && !isSearchActive && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-2"
            >
              <div className="border-border/40 bg-background/80 shadow-primary/5 rounded-2xl border p-2 shadow-lg backdrop-blur-xl">
                <a
                  href="/blog"
                  className="text-muted-foreground hover:bg-muted hover:text-foreground block rounded-lg px-4 py-2.5 text-sm transition-colors"
                >
                  Blog
                </a>
                <a
                  href="/blog/tags"
                  className="text-muted-foreground hover:bg-muted hover:text-foreground block rounded-lg px-4 py-2.5 text-sm transition-colors"
                >
                  Tags
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
