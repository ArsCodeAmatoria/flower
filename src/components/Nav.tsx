"use client";

import { useCallback } from "react";
import { Users, Mic2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "characters", label: "Characters", icon: Users },
  { id: "lyrics", label: "Lyrics", icon: Mic2 },
  { id: "script", label: "Script", icon: BookOpen },
];

export function Nav() {
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    const container = document.querySelector(".horizontal-scroll-container") as HTMLElement | null;
    if (el && container) {
      container.scrollTo({
        left: el.offsetLeft,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[100vw] items-center justify-between px-6 lg:px-12">
        <button
          type="button"
          onClick={() => scrollToSection("characters")}
          className="font-cinematic text-xl font-bold tracking-[0.2em] text-white transition-opacity hover:opacity-90"
        >
          FLOWER
        </button>
        <div className="flex items-center gap-8">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToSection(id)}
              className={cn(
                "flex items-center gap-2 text-sm font-medium tracking-wider text-white/90",
                "transition-colors hover:text-white"
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
