"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CharacterDossier } from "@/data/character-dossiers";
import {
  CHARACTER_MCKEE_RULES,
  CHARACTER_SAVE_THE_CAT_RULES,
} from "@/data/character-theory-templates";

function Collapsible({
  id,
  title,
  defaultOpen = false,
  children,
}: {
  id: string;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="mb-2 rounded-xl border border-white/10 bg-white/[0.03]"
      data-section={id}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors hover:bg-white/5"
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/85"
          style={{ fontFamily: "var(--font-cinematic)" }}
        >
          {title}
        </span>
        <ChevronDown
          className={cn("size-3.5 shrink-0 text-white/45 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="border-t border-white/8 px-3 pb-3 pt-1">{children}</div>}
    </div>
  );
}

function AppliedBlock({ bullets }: { bullets: string[] }) {
  if (bullets.length === 0) return null;
  return (
    <div className="mt-2 rounded-lg border border-amber-200/15 bg-amber-200/[0.04] px-2.5 py-2">
      <p className="mb-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-amber-200/60">
        Applied
      </p>
      <ul className="list-inside list-disc space-y-1 text-[9px] leading-snug text-white/70">
        {bullets.map((line, j) => (
          <li key={`${j}-${line.slice(0, 24)}`}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

function LabeledList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.15em] text-white/45">{label}</p>
      <ul className="list-inside list-disc space-y-0.5 text-[9px] leading-snug text-white/65">
        {items.map((x, j) => (
          <li key={`${j}-${x.slice(0, 24)}`}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

/** Save the Cat, McKee, operating system, dialogue, arc tracker, scene placeholder — collapsible dossier blocks. */
export function CharacterDossierCollapsibles({ dossier }: { dossier: CharacterDossier }) {
  return (
    <div className="space-y-2 pt-2">
      <Collapsible id="character_save_the_cat_rules" title="Save the Cat — character rules" defaultOpen>
        <p className="mb-3 text-[9px] leading-relaxed text-white/40" style={{ fontFamily: "var(--font-screenplay)" }}>
          Read-only craft reminders. Each rule pairs with how it lands on this character.
        </p>
        <div className="space-y-4">
          {CHARACTER_SAVE_THE_CAT_RULES.map((rule, i) => (
            <div key={rule.id} className="rounded-lg border border-white/8 bg-black/25 px-2.5 py-2.5">
              <p className="text-[10px] font-semibold text-white/90" style={{ fontFamily: "var(--font-cinematic)" }}>
                {i + 1}. {rule.title}
              </p>
              <p className="mt-1 text-[9px] leading-snug text-white/55">{rule.principle}</p>
              {rule.craftReminders.length > 0 && (
                <p className="mt-1.5 text-[8px] uppercase tracking-wider text-white/35">
                  Reminders: {rule.craftReminders.join(" · ")}
                </p>
              )}
              <AppliedBlock bullets={dossier.stcApplied[i] ?? []} />
            </div>
          ))}
        </div>
      </Collapsible>

      <Collapsible id="character_mckee_rules" title="McKee — character rules" defaultOpen>
        <p className="mb-3 text-[9px] text-white/40" style={{ fontFamily: "var(--font-screenplay)" }}>
          Principles for pressure, subtext, and behavior on screen.
        </p>
        <div className="space-y-4">
          {CHARACTER_MCKEE_RULES.map((rule, i) => (
            <div key={rule.id} className="rounded-lg border border-white/8 bg-black/25 px-2.5 py-2.5">
              <p className="text-[10px] font-semibold text-white/90" style={{ fontFamily: "var(--font-cinematic)" }}>
                {i + 1}. {rule.title}
              </p>
              <p className="mt-1 text-[9px] leading-snug text-white/55">{rule.principle}</p>
              <AppliedBlock bullets={dossier.mckeeApplied[i] ?? []} />
            </div>
          ))}
        </div>
      </Collapsible>

      <Collapsible id="character_operating_system" title="Character operating system" defaultOpen>
        <p className="mb-3 text-[9px] text-white/40" style={{ fontFamily: "var(--font-screenplay)" }}>
          Usable behavior map for breaking scenes — what they always do, never do, and how they break.
        </p>
        <LabeledList label="What this character always does" items={dossier.operatingSystem.alwaysDoes} />
        <LabeledList label="What this character never does" items={dossier.operatingSystem.neverDoes} />
        <LabeledList label="How this character handles conflict" items={dossier.operatingSystem.handlesConflict} />
        <LabeledList label="What breaks this character" items={dossier.operatingSystem.whatBreaksThem} />
        <LabeledList label="What changes this character" items={dossier.operatingSystem.whatChangesThem} />
      </Collapsible>

      <Collapsible id="character_dialogue_identity" title="Dialogue identity (McKee applied)">
        <LabeledList label="Speech pattern" items={dossier.dialogueIdentity.speechPattern} />
        <LabeledList label="Verbal actions (most common)" items={dossier.dialogueIdentity.verbalActions} />
        <LabeledList label="Subtext style" items={dossier.dialogueIdentity.subtextStyle} />
        <LabeledList label="Example lines" items={dossier.dialogueIdentity.exampleLines} />
      </Collapsible>

      <Collapsible id="character_arc_tracker" title="Arc tracker">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          {(
            [
              ["Start", dossier.arcTracker.start],
              ["Middle", dossier.arcTracker.middle],
              ["End", dossier.arcTracker.end],
            ] as const
          ).map(([label, text]) => (
            <div
              key={label}
              className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5"
            >
              <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.2em] text-amber-200/55">
                {label}
              </p>
              <p className="text-[10px] leading-snug text-white/75" style={{ fontFamily: "var(--font-screenplay)" }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </Collapsible>

      <Collapsible id="character_scene_tracking" title="Scene tracking">
        <p className="text-[9px] leading-relaxed text-white/45" style={{ fontFamily: "var(--font-screenplay)" }}>
          Optional: tie beats to scene metadata and dialogue patterns. Not wired yet — read-only dossier only
          for now.
        </p>
      </Collapsible>
    </div>
  );
}
