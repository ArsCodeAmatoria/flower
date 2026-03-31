"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  saveTheCatBeats,
  sceneRules,
  dialogueRules,
  characterRules,
  themeRules,
  pacingRules,
} from "@/data/writing-rules";

export type ScriptMetadataAnchors = {
  actId?: string;
  beatId?: string;
  threadId?: string;
  themeCore?: string;
  sceneTitle?: string;
};

function Section({
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
    <div className="mb-2 rounded-xl border border-zinc-200 bg-white" data-section={id}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors hover:bg-zinc-50"
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-800"
          style={{ fontFamily: "var(--font-cinematic)" }}
        >
          {title}
        </span>
        <ChevronDown className={cn("size-3.5 shrink-0 text-zinc-500 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="border-t border-zinc-200/90 px-3 pb-3 pt-1">{children}</div>
      )}
    </div>
  );
}

function AnchorRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded border border-zinc-200/90 bg-zinc-100 px-2 py-1.5">
      <span className="text-[8px] uppercase tracking-wider text-red-700">{label}</span>
      <span className="text-[10px] text-zinc-800" style={{ fontFamily: "var(--font-screenplay)" }}>
        {value}
      </span>
    </div>
  );
}

export function WritingRulesSidebar({ scriptAnchors }: { scriptAnchors?: ScriptMetadataAnchors }) {
  const hasAnchors =
    scriptAnchors &&
    (scriptAnchors.actId ||
      scriptAnchors.beatId ||
      scriptAnchors.threadId ||
      scriptAnchors.themeCore ||
      scriptAnchors.sceneTitle);

  return (
    <div
      className="w-[340px] shrink-0 overflow-y-auto border-r border-zinc-200 pl-6 pr-3 pb-24 pt-2"
      style={{ scrollbarWidth: "none" }}
    >
      <p
        className="mb-3 px-1 text-[9px] uppercase tracking-[0.35em] text-red-800"
        style={{ fontFamily: "var(--font-cinematic)" }}
      >
        Writing rules
      </p>
      <p className="mb-4 px-1 text-[9px] leading-relaxed text-zinc-500" style={{ fontFamily: "var(--font-screenplay)" }}>
        Blueprint for Cursor and the writer — Save the Cat beats, scene craft, dialogue (McKee-style checks), character, theme, pacing.
      </p>

      {hasAnchors && (
        <Section id="script_metadata_anchors" title="Current scene — script metadata" defaultOpen>
          <p className="mb-2 text-[8px] text-zinc-500">
            Parsed from <span className="text-zinc-600">[[key: value]]</span> lines in Draft 2.
          </p>
          <div className="flex flex-col gap-1.5">
            {scriptAnchors!.sceneTitle?.trim() && (
              <AnchorRow label="scene.title" value={scriptAnchors!.sceneTitle!} />
            )}
            {scriptAnchors!.actId?.trim() && <AnchorRow label="act.id" value={scriptAnchors!.actId!} />}
            {scriptAnchors!.beatId?.trim() && <AnchorRow label="beat.id" value={scriptAnchors!.beatId!} />}
            {scriptAnchors!.threadId?.trim() && <AnchorRow label="thread.id" value={scriptAnchors!.threadId!} />}
            {scriptAnchors!.themeCore?.trim() && <AnchorRow label="theme.core" value={scriptAnchors!.themeCore!} />}
          </div>
        </Section>
      )}

      <Section id="story_structure_rules" title="Story structure" defaultOpen>
        <p className="mb-2 text-[9px] text-zinc-500">Save the Cat — what each beat must do + target pages.</p>
        <div className="flex max-h-[min(40vh,320px)] flex-col gap-2 overflow-y-auto pr-1" style={{ scrollbarWidth: "none" }}>
          {saveTheCatBeats.map((b) => (
            <div key={b.id} className="rounded-lg border border-zinc-200/90 bg-zinc-100 px-2.5 py-2">
              <p className="text-[10px] font-semibold text-zinc-900" style={{ fontFamily: "var(--font-cinematic)" }}>
                {b.label}{" "}
                <span className="font-normal text-zinc-500">({b.targetRange})</span>
              </p>
              <p className="mt-1 text-[9px] leading-snug text-zinc-600">{b.purpose}</p>
              <p className="mt-1 text-[9px] italic text-red-700">Must do: {b.mustDo}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="scene_rules" title="Scene rules">
        <ul className="space-y-2">
          {sceneRules.map((r) => (
            <li key={r.id} className="rounded-lg border border-zinc-200/90 bg-zinc-100 px-2 py-1.5">
              <p className="text-[10px] font-medium text-zinc-800">{r.headline}</p>
              <p className="text-[9px] text-zinc-500">{r.detail}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="dialogue_rules" title="Dialogue rules">
        <div className="flex max-h-[min(36vh,280px)] flex-col gap-2 overflow-y-auto pr-1">
          {dialogueRules.map((r) => (
            <div key={r.id} className="rounded-lg border border-zinc-200/90 bg-zinc-100 px-2 py-1.5">
              <p className="text-[10px] font-semibold text-zinc-900">{r.label}</p>
              <p className="text-[9px] text-zinc-600">{r.rule}</p>
              <p className="mt-1 text-[9px] text-zinc-600">Test: {r.test}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="character_rules" title="Character rules">
        <ul className="space-y-1.5">
          {characterRules.map((r) => (
            <li key={r.id} className="text-[9px]">
              <span className="font-medium text-zinc-800">{r.label} — </span>
              <span className="text-zinc-500">{r.detail}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="theme_rules" title="Theme rules">
        <ul className="space-y-1.5">
          {themeRules.map((r) => (
            <li key={r.id} className="text-[9px]">
              <span className="font-medium text-zinc-800">{r.label} — </span>
              <span className="text-zinc-500">{r.detail}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="pacing_rules" title="Pacing & page targets" defaultOpen>
        <ul className="space-y-2">
          {pacingRules.map((r) => (
            <li key={r.id} className="rounded-lg border border-zinc-200/90 px-2 py-1.5">
              <p className="text-[10px] text-zinc-800">{r.headline}</p>
              <p className="text-[9px] text-zinc-500">{r.detail}</p>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
