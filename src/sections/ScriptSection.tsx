"use client";

import { scriptPages, pageLabels } from "@/data/script";
import { ScriptDraft2Cockpit } from "@/sections/script/ScriptDraft2Cockpit";

interface Props {
  openCharacter: (id: string) => void;
}

export function ScriptSection({ openCharacter: _oc }: Props) {
  return (
    <section
      id="script"
      className="relative flex h-screen w-screen shrink-0 flex-col overflow-hidden bg-black pt-14"
    >
      <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-3 px-8 pt-3">
        <h1 className="section-heading text-2xl">Script</h1>
        <p
          className="max-w-md text-right text-[10px] font-medium uppercase tracking-[0.18em] text-white/40"
          style={{ fontFamily: "var(--font-cinematic)" }}
        >
          Working draft
        </p>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <ScriptDraft2Cockpit pages={scriptPages} labels={pageLabels} />
      </div>
    </section>
  );
}
