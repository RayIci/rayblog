import { motion } from "motion/react";
import { Github, Linkedin, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-24">
      <motion.div
        className="relative flex flex-col items-start gap-5"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Greeting */}
        <motion.div variants={item} className="flex items-center gap-2">
          <span className="border-primary/20 bg-primary/10 text-primary rounded-full border px-3 py-1 font-mono text-xs">
            software engineer
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={item}
          className="text-4xl font-bold tracking-tight md:text-6xl"
        >
          Hi, I&apos;m <span className="gradient-text">Alex.</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={item}
          className="text-muted-foreground max-w-xl text-base leading-relaxed md:text-lg"
        >
          Personal knowledge base & engineering blog — things I keep looking up,
          ideas I keep thinking about, and notes on tech, math, and AI that I
          actually want to remember.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="flex flex-wrap items-center gap-3"
        >
          <Button asChild size="default">
            <a href="/blog">
              <BookOpen className="mr-2 h-4 w-4" />
              Read the blog
            </a>
          </Button>
          <Button asChild variant="ghost" size="default">
            <a href="/blog/tags">
              Browse topics
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </motion.div>

        {/* Social links */}
        <motion.div variants={item} className="flex items-center gap-3 pt-1">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="border-border/60 text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary flex size-9 items-center justify-center rounded-lg border transition-colors"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="border-border/60 text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary flex size-9 items-center justify-center rounded-lg border transition-colors"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
