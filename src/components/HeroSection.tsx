import { motion } from "motion/react";
import { Github, Linkedin, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroScene } from "@/components/HeroScene";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const lineItem = {
  hidden: { scaleX: 0, opacity: 0 },
  show: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="grid md:grid-cols-[1fr_420px] md:items-center md:gap-8">
        <motion.div
          className="relative flex flex-col items-start gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Name */}
          <motion.h1
            variants={item}
            className="text-5xl leading-none font-bold tracking-tight md:text-7xl"
          >
            Alex Valle<span className="gradient-text">.</span>
          </motion.h1>

          {/* Role */}
          <motion.p
            variants={item}
            className="text-muted-foreground font-mono text-sm"
          >
            Software Engineer
          </motion.p>

          {/* Separator */}
          <motion.div
            variants={lineItem}
            className="bg-border/80 my-1 h-px w-full origin-left"
          />

          {/* Tagline */}
          <motion.p
            variants={item}
            className="text-muted-foreground max-w-lg text-base leading-relaxed"
          >
            Personal knowledge base &amp; engineering blog — things I keep
            looking up, ideas worth writing down, notes on tech and systems.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="mt-1 flex flex-wrap items-center gap-2"
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
          <motion.div variants={item} className="flex items-center gap-2 pt-1">
            <a
              href="https://github.com/RayIci"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground flex size-8 items-center justify-center rounded-lg border transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://www.linkedin.com/in/alex-valle-247875242/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground flex size-8 items-center justify-center rounded-lg border transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        </motion.div>

        {/* 3D scene — desktop only */}
        <div className="hidden md:flex md:items-center md:justify-center">
          <HeroScene />
        </div>
      </div>
    </section>
  );
}
