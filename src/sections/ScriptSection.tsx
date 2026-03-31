"use client";

import { useState } from "react";
import { scriptPages, pageLabels } from "@/data/script";
import { ScriptDraft2Cockpit } from "@/sections/script/ScriptDraft2Cockpit";
import { FlowerBeatsStructure } from "@/sections/script/FlowerBeatsStructure";
import { cn } from "@/lib/utils";

interface Props {
  openCharacter: (id: string) => void;
}

type ScriptView = "structure" | "script";

export function ScriptSection({ openCharacter: _oc }: Props) {
  const [view, setView] = useState<ScriptView>("structure");

  return (
    <section
      id="script"
      className="relative flex h-screen w-screen shrink-0 flex-col overflow-hidden bg-black pt-14"
    >
      <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-3 px-8 pt-3">
        <h1 className="section-heading text-3xl">Script</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="flex rounded-full border border-white/12 bg-white/[0.04] p-0.5"
            role="tablist"
            aria-label="Script view"
          >
            <button
              type="button"
              role="tab"
              aria-selected={view === "structure"}
              onClick={() => setView("structure")}
              className={cn(
                "rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.15em] transition-colors",
                view === "structure"
                  ? "bg-white/14 text-white"
                  : "text-white/45 hover:text-white/75",
              )}
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              Structure
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "script"}
              onClick={() => setView("script")}
              className={cn(
                "rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.15em] transition-colors",
                view === "script"
                  ? "bg-white/14 text-white"
                  : "text-white/45 hover:text-white/75",
              )}
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              Whole script
            </button>
          </div>
          <p
            className="max-w-[12rem] text-right text-[10px] font-medium uppercase tracking-[0.18em] text-white/40 sm:max-w-md"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            {view === "structure" ? "15 beats · final" : "Screenplay scaffold"}
          </p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {view === "structure" ? (
          <FlowerBeatsStructure />
        ) : (
          <ScriptDraft2Cockpit pages={scriptPages} labels={pageLabels} />
        )}
      </div>
    </section>
  );
}
