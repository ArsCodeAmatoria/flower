"use client";

import type { CSSProperties } from "react";
import type { ScriptPage } from "@/data/script-core";
import { cn } from "@/lib/utils";

export function getPageTitle(page: ScriptPage, labels: Record<string, string>): string {
  const custom = labels[page.id];
  if (custom) return custom;
  const el = page.elements.find((e) => e.type === "scene");
  if (!el) return page.id;
  const parts = el.text.split("—");
  return parts[0].trim();
}

export function ScriptLine({
  type,
  text,
}: {
  type: ScriptPage["elements"][0]["type"];
  text: string;
}) {
  const base: CSSProperties = {
    fontFamily: "var(--font-screenplay)",
    lineHeight: "1.6",
  };

  switch (type) {
    case "metadata":
      return null;
    case "fade":
    case "transition":
      return (
        <p
          className={cn("text-sm uppercase text-white/50", type === "transition" && "text-right")}
          style={{ ...base, letterSpacing: "0.05em" }}
        >
          {text}
        </p>
      );
    case "scene":
      return (
        <p className="text-sm font-bold uppercase text-white" style={{ ...base, letterSpacing: "0.05em" }}>
          {text}
        </p>
      );
    case "action":
      return <p className="text-sm text-white/80" style={base}>{text}</p>;
    case "character":
      return (
        <p className="pt-1 text-sm font-bold uppercase text-white" style={{ ...base, paddingLeft: "35%" }}>
          {text}
        </p>
      );
    case "parenthetical":
      return (
        <p className="text-sm italic text-white/60" style={{ ...base, paddingLeft: "30%" }}>
          {text}
        </p>
      );
    case "dialogue":
      return (
        <p className="pb-1 text-sm text-white/90" style={{ ...base, paddingLeft: "20%", paddingRight: "20%" }}>
          {text}
        </p>
      );
    default:
      return null;
  }
}

export function ScreenplayLetterhead({ draftLabel }: { draftLabel: string }) {
  return (
    <div className="mb-10 border-b border-white/8 pb-10 text-center">
      <p
        className="mb-1 text-[9px] uppercase tracking-[0.5em] text-white/30"
        style={{ fontFamily: "var(--font-cinematic)" }}
      >
        Feature Film — Original Screenplay
      </p>
      <h2
        className="mb-1 text-4xl tracking-wide text-white/80"
        style={{ fontFamily: "var(--font-title)" }}
      >
        Flower
      </h2>
      <p
        className="mb-6 text-[10px] uppercase tracking-[0.35em] text-white/30"
        style={{ fontFamily: "var(--font-cinematic)" }}
      >
        Animated musical feature
      </p>
      <div className="mx-auto mb-6 h-px w-12 bg-white/15" />
      <p
        className="text-[11px] text-white/45"
        style={{ fontFamily: "var(--font-screenplay)" }}
      >
        Created by Lynne Tapper
      </p>
      <p
        className="mt-1 text-[11px] text-white/45"
        style={{ fontFamily: "var(--font-screenplay)" }}
      >
        Co-written by Leigh Akin
      </p>
      <p
        className="mt-1 text-[11px] text-white/45"
        style={{ fontFamily: "var(--font-screenplay)" }}
      >
        Songs by Leigh Akin
      </p>
      <p
        className="mt-4 text-[9px] uppercase tracking-[0.3em] text-white/20"
        style={{ fontFamily: "var(--font-cinematic)" }}
      >
        {draftLabel} — {new Date().getFullYear()}
      </p>
    </div>
  );
}
