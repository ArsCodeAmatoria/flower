"use client";

import { cn } from "@/lib/utils";

interface DialogueLine {
  character: string;
  line: string;
}

interface ScreenplayBlockProps {
  lines: DialogueLine[];
  className?: string;
}

/**
 * Renders dialogue in screenplay format:
 * CHARACTER NAME (caps)
 * Dialogue text.
 */
export function ScreenplayBlock({ lines, className }: ScreenplayBlockProps) {
  return (
    <div
      className={cn("font-screenplay space-y-4 text-left text-white", className)}
      style={{ fontFamily: "var(--font-screenplay), monospace" }}
    >
      {lines.map(({ character, line }, i) => (
        <div key={i} className="space-y-1">
          <div className="text-sm font-bold uppercase tracking-widest text-white/90">
            {character}
          </div>
          <p className="max-w-prose pl-4 text-sm leading-relaxed text-white/95">
            {line}
          </p>
        </div>
      ))}
    </div>
  );
}
