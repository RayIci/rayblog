import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import Fuse from "fuse.js";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "@/components/SearchBar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PostSearchData {
  id: string;
  title: string;
  description?: string;
  tags: string[];
}

interface HeaderProps {
  posts: PostSearchData[];
  currentPath: string;
}

const FADE = { duration: 0.2, ease: "easeInOut" } as const;

export function Header({ posts, currentPath }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // Keyboard: Escape closes search, ⌘K / Ctrl+K opens it
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        handleOpen();
      } else if (e.key === "Escape" && isSearchActive) {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSearchActive, handleOpen, handleClose]);

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

  const frosted = isScrolled || isSearchActive;
  const showResults = isSearchActive && query.length > 0;

  return (
    <header className="fixed inset-x-0 top-5 z-50 px-4">
      <div ref={containerRef} className="mx-auto max-w-4xl">
        {/* Nav pill */}
        <nav
          className={cn(
            "relative flex h-12 items-center gap-2 rounded-xl border px-4",
            "transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
            frosted
              ? "bg-background/80 border-foreground/10 shadow-sm backdrop-blur-md"
              : "border-transparent bg-transparent shadow-none backdrop-blur-none",
          )}
        >
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

          {/* Desktop nav group: search bar + Blog + Tags + ThemeToggle */}
          <motion.div
            animate={{ opacity: isSearchActive ? 0 : 1 }}
            transition={FADE}
            style={{ pointerEvents: isSearchActive ? "none" : "auto" }}
            className="ml-auto hidden shrink-0 items-center gap-1 md:flex"
          >
            {/* Compact search bar */}
            <div className="relative cursor-pointer" onClick={handleOpen}>
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
              <div className="bg-muted/50 hover:bg-muted/80 border-border/40 flex w-36 items-center justify-between rounded-lg border py-1.5 pr-2 pl-8 text-sm transition-colors">
                <span className="text-muted-foreground/60">Search…</span>
                <kbd className="text-muted-foreground/50 border-border/60 rounded border px-1.5 py-0.5 font-mono text-[10px] leading-none">
                  ⌘K
                </kbd>
              </div>
            </div>
            <a
              href="/blog"
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm transition-colors",
                currentPath.startsWith("/blog") &&
                  !currentPath.startsWith("/blog/tags")
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              Blog
            </a>
            <a
              href="/blog/tags"
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm transition-colors",
                currentPath.startsWith("/blog/tags")
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              Tags
            </a>
            <ThemeToggle />
          </motion.div>

          {/* Mobile-only right group: theme toggle + search icon + hamburger */}
          <motion.div
            animate={{ opacity: isSearchActive ? 0 : 1 }}
            transition={FADE}
            style={{ pointerEvents: isSearchActive ? "none" : "auto" }}
            className="ml-auto flex shrink-0 items-center gap-1 md:hidden"
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

          {/* Search overlay — always in DOM so it works on mobile too */}
          <SearchBar
            isActive={isSearchActive}
            query={query}
            onChange={setQuery}
            onClose={handleClose}
          />
        </nav>

        {/* Search results panel */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="border-foreground/10 bg-background/95 mt-2 overflow-hidden rounded-xl border shadow-lg backdrop-blur-sm"
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
              <div className="border-foreground/10 bg-background/95 rounded-xl border p-2 shadow-lg backdrop-blur-sm">
                <a
                  href="/blog"
                  className={cn(
                    "block rounded-lg px-4 py-2.5 text-sm transition-colors",
                    currentPath.startsWith("/blog") &&
                      !currentPath.startsWith("/blog/tags")
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  Blog
                </a>
                <a
                  href="/blog/tags"
                  className={cn(
                    "block rounded-lg px-4 py-2.5 text-sm transition-colors",
                    currentPath.startsWith("/blog/tags")
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
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
