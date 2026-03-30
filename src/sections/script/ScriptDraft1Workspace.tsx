"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { Play, Pause, Download } from "lucide-react";
import { getScriptPageStarts, getTotalScreenplayPages, type ScriptPage } from "@/data/script";
import { SCRIPT_ACT_NAV } from "@/data/script-act-structure";
import { characters } from "@/data/characters";
import { songs } from "@/data/songs";
import { sets } from "@/data/sets";
import { crew } from "@/data/crew";
import { cn } from "@/lib/utils";
import { getPageTitle, ScriptLine, ScreenplayLetterhead } from "@/sections/script/ScriptPanelShared";
import { MoonWidget, getScriptHourForPage } from "@/sections/script/ScriptMoonWidget";

export function ScriptDraft1Workspace({
  pages,
  labels,
  openCharacter,
  openSet,
}: {
  pages: ScriptPage[];
  labels: Record<string, string>;
  openCharacter: (id: string) => void;
  openSet: (id: string) => void;
}) {
  const scriptPageStarts = useMemo(() => getScriptPageStarts(pages), [pages]);
  const totalScreenplayPages = useMemo(() => getTotalScreenplayPages(pages), [pages]);
  const [page, setPage] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const total = pages.length;
  const current = pages[page];
  const currentScreenplayPage = scriptPageStarts[Math.min(page, scriptPageStarts.length - 1)] ?? 1;

  const scriptTime = getScriptHourForPage(pages, page);
  const pageCharacters = (current.characterIds ?? [])
    .map((id) => characters.find((c) => c.id === id))
    .filter(Boolean) as typeof characters;
  const pageSongs = (current.songIds ?? [])
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean) as typeof songs;
  const pageSets = (current.setIds ?? [])
    .map((id) => sets.find((s) => s.id === id))
    .filter(Boolean) as typeof sets;

  // Track visible page via IntersectionObserver — prefer topmost visible page
  // so we show the correct songs when between two sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let topmostIdx = -1;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = pageRefs.current.findIndex((r) => r === entry.target);
            if (idx !== -1 && (topmostIdx === -1 || idx < topmostIdx)) topmostIdx = idx;
          }
        });
        if (topmostIdx !== -1) setPage(topmostIdx);
      },
      { root: scrollRef.current, threshold: 0.4 }
    );
    pageRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [pages]);

  const stopAudio = useCallback(() => {
    audioRef.current?.pause();
    setPlayingId(null);
  }, []);

  const togglePlay = useCallback(
    (song: typeof songs[0]) => {
      if (playingId === song.id) {
        audioRef.current?.pause();
        setPlayingId(null);
      } else {
        audioRef.current?.pause();
        const audio = new Audio(song.audioSrc);
        audio.addEventListener("ended", () => setPlayingId(null));
        audio.play().catch(() => {});
        audioRef.current = audio;
        setPlayingId(song.id);
      }
    },
    [playingId]
  );

  const scrollToPage = useCallback((i: number) => {
    stopAudio();
    const target = pageRefs.current[Math.max(0, Math.min(total - 1, i))];
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [total, stopAudio]);

  return (
    <div className="flex min-h-0 w-full flex-1 overflow-hidden">
        {/* ── Left: Act / Scene navigation ───────────────────── */}
        <div
          className="w-52 shrink-0 overflow-y-auto pl-8 pr-4"
          style={{ scrollbarWidth: "none" }}
        >
          {SCRIPT_ACT_NAV.map((act) => (
            <div key={act.label} className="mb-5">
              <button
                type="button"
                onClick={() => scrollToPage(act.start)}
                className={cn(
                  "mb-2 flex items-center gap-2 text-left transition-colors",
                  page >= act.start && page <= act.end
                    ? "text-white"
                    : "text-white/55 hover:text-white/80"
                )}
              >
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.3em]"
                  style={{ fontFamily: "var(--font-cinematic)" }}
                >
                  {act.label}
                </span>
                {page >= act.start && page <= act.end && (
                  <span className="h-px flex-1 bg-white/20" />
                )}
              </button>

              <div className="flex flex-col gap-0.5">
                {act.sections ? (
                  act.sections.map((sec) => (
                    <div key={sec.label} className="mb-2">
                      <div
                        className="mb-1 px-2 py-0.5 text-[8px] uppercase tracking-[0.2em] text-white/35"
                        style={{ fontFamily: "var(--font-cinematic)" }}
                      >
                        {sec.label}
                      </div>
                      {pages.slice(sec.start, sec.end + 1).map((p, offset) => {
                        const idx = sec.start + offset;
                        const isActive = idx === page;
                        const label = getPageTitle(p, labels);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => scrollToPage(idx)}
                            className={cn(
                              "group flex items-start gap-2 rounded-lg px-2 py-1 text-left transition-all duration-150",
                              isActive
                                ? "bg-white/10 text-white"
                                : "text-white/60 hover:bg-white/5 hover:text-white/85"
                            )}
                          >
                            <span
                              className="mt-0.5 shrink-0 text-[9px] tabular-nums text-white/40"
                              style={{ fontFamily: "var(--font-screenplay)" }}
                            >
                              {String(scriptPageStarts[idx] ?? idx + 1).padStart(2, "0")}
                            </span>
                            <span
                              className="line-clamp-2 text-[10px] leading-snug"
                              style={{ fontFamily: "var(--font-cinematic)" }}
                            >
                              {label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))
                ) : (
                  pages.slice(act.start, act.end + 1).map((p, offset) => {
                    const idx = act.start + offset;
                    const isActive = idx === page;
                    const label = getPageTitle(p, labels);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => scrollToPage(idx)}
                        className={cn(
                          "group flex items-start gap-2 rounded-lg px-2 py-1 text-left transition-all duration-150",
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-white/60 hover:bg-white/5 hover:text-white/85"
                        )}
                      >
                        <span
                          className="mt-0.5 shrink-0 text-[9px] tabular-nums text-white/40"
                          style={{ fontFamily: "var(--font-screenplay)" }}
                        >
                          {String(scriptPageStarts[idx] ?? idx + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="line-clamp-2 text-[10px] leading-snug"
                          style={{ fontFamily: "var(--font-cinematic)" }}
                        >
                          {label}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Center: Scrolling screenplay ─────────────────────── */}
        <div
          ref={scrollRef}
          className="relative flex-1 overflow-y-auto pb-20"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Left margin rule */}
          <div className="pointer-events-none absolute left-[calc(50%-20rem)] top-0 bottom-0 w-px bg-white/8" />

          <div className="mx-auto max-w-xl px-4 py-6 pb-16">

            {/* ── Letterhead ──────────────────────────────────── */}
            <ScreenplayLetterhead draftLabel="Draft 1" />

            {pages.map((p, idx) => (
              <div
                key={p.id}
                ref={(el) => { pageRefs.current[idx] = el; }}
                className="mb-1"
              >
                {/* Page separator + number (screenplay format) */}
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[10px] tabular-nums",
                      p.isBible
                        ? "border-white/20 bg-white/10 text-white/70"
                        : "border-white/15 bg-white/6 text-white/55"
                    )}
                    style={{ fontFamily: "var(--font-screenplay)" }}
                  >
                    {p.isBible ? p.id.replace("bible-", "§") : String(scriptPageStarts[idx] ?? idx + 1)}
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Page content */}
                {p.isBible ? (
                  <div className="mb-12 rounded-2xl border border-white/8 bg-white/3 px-8 py-8 space-y-4">
                    {p.elements
                      .filter((el) => el.type !== "metadata")
                      .map((el, i) => {
                      if (el.type === "scene") return (
                        <p key={i} className="pt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/55" style={{ fontFamily: "var(--font-cinematic)" }}>
                          {el.text}
                        </p>
                      );
                      if (el.type === "fade") return (
                        <div key={i} className="my-2 h-px w-full bg-white/8" />
                      );
                      if (el.type === "character") return (
                        <p key={i} className="mt-4 text-xs font-semibold uppercase tracking-widest text-white/80" style={{ fontFamily: "var(--font-cinematic)" }}>
                          {el.text}
                        </p>
                      );
                      if (el.type === "dialogue") return (
                        <p key={i} className="ml-6 text-sm italic leading-relaxed text-white/70" style={{ fontFamily: "var(--font-screenplay)" }}>
                          "{el.text}"
                        </p>
                      );
                      return (
                        <p key={i} className="text-sm leading-relaxed text-white/60" style={{ fontFamily: "var(--font-screenplay)" }}>
                          {el.text}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2 pb-12">
                    {p.elements
                      .filter((el) => el.type !== "metadata")
                      .map((el, i) => (
                      <div key={i} className="flex gap-3 items-baseline">
                        <span
                          className="w-8 shrink-0 text-right text-[10px] tabular-nums text-white/25 select-none"
                          title={`${p.id} visible line ${i + 1}`}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <ScriptLine type={el.type} text={el.text} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Contextual sidebar ───────────────────────── */}
        <div
          className="flex w-56 shrink-0 flex-col gap-5 overflow-y-auto rounded-2xl border border-white/8 p-4 pb-20 mr-8"
          style={{ background: "rgba(255,255,255,0.03)", scrollbarWidth: "none" }}
        >
          {/* Download script PDF */}
          <a
            href="/pdf/fish-script.pdf"
            download="FLOWER-Script.pdf"
            className="group flex items-center gap-2.5 rounded-xl border border-white/15 px-3 py-2.5 transition-all hover:border-white/30 hover:bg-white/8"
          >
            <Download className="size-3.5 shrink-0 text-white/60 transition-colors group-hover:text-white" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-white/80 group-hover:text-white" style={{ fontFamily: "var(--font-cinematic)" }}>
                Download Script
              </p>
              <p className="text-[9px] text-white/40" style={{ fontFamily: "var(--font-screenplay)" }}>
                FLOWER — PDF
              </p>
            </div>
          </a>

          {/* Scene + screenplay page counter */}
          <div className="flex flex-col gap-1 px-1">
            <div className="flex items-center gap-2">
              <span
                className="text-xl font-bold tabular-nums text-white"
                style={{ fontFamily: "var(--font-screenplay)" }}
              >
                {String(page + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col justify-center gap-0.5">
                <div className="h-px w-6 bg-white/20" />
                <span
                  className="text-[10px] tabular-nums text-white/35"
                  style={{ fontFamily: "var(--font-screenplay)" }}
                >
                  {String(total).padStart(2, "0")}
                </span>
              </div>
              <span
                className="ml-1 text-[9px] uppercase tracking-[0.3em] text-white/30"
                style={{ fontFamily: "var(--font-cinematic)" }}
              >
                Scene
              </span>
            </div>
            <p
              className="text-[9px] text-white/30"
              style={{ fontFamily: "var(--font-screenplay)" }}
            >
              p.{String(currentScreenplayPage).padStart(2, "0")} / {String(totalScreenplayPages).padStart(2, "0")}
            </p>
          </div>

          <div className="h-px bg-white/8" />

          {/* Cast */}
          {pageCharacters.length > 0 && (
            <div>
              <p
                className="mb-3 text-[9px] uppercase tracking-[0.28em] text-white/55"
                style={{ fontFamily: "var(--font-cinematic)" }}
              >
                Cast
              </p>
              <div className="flex flex-col gap-2">
                {pageCharacters.map((char) => (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => openCharacter(char.id)}
                    className="group flex items-center gap-2.5 rounded-xl border border-transparent px-2 py-1.5 text-left transition-all hover:border-white/15 hover:bg-white/5"
                  >
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
                      <Image src={char.image} alt={char.name} fill className="object-cover object-top" sizes="32px" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-white/90 group-hover:text-white" style={{ fontFamily: "var(--font-cinematic)" }}>
                        {char.name}
                      </p>
                      <p className="truncate text-[9px] text-white/55">{char.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {pageCharacters.length > 0 && pageSongs.length > 0 && <div className="h-px bg-white/8" />}

          {/* Songs */}
          {pageSongs.length > 0 && (
            <div>
              <p
                className="mb-3 text-[9px] uppercase tracking-[0.28em] text-white/55"
                style={{ fontFamily: "var(--font-cinematic)" }}
              >
                Songs
              </p>
              <div className="flex flex-col gap-1.5">
                {pageSongs.map((song) => {
                  const isPlaying = playingId === song.id;
                  return (
                    <button
                      key={song.id}
                      type="button"
                      onClick={() => togglePlay(song)}
                      className={cn(
                        "group flex w-full items-center gap-2.5 rounded-xl border px-2 py-1.5 text-left transition-all duration-200",
                        isPlaying
                          ? "border-white/30 bg-white/12"
                          : "border-white/8 bg-white/4 hover:border-white/20 hover:bg-white/8"
                      )}
                    >
                      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                        <Image src={song.image} alt={song.title} fill className="object-cover object-top" sizes="32px" />
                        <div className={cn("absolute inset-0 flex items-center justify-center bg-black/55 transition-opacity", isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                          {isPlaying ? <Pause className="size-3 fill-white text-white" /> : <Play className="size-3 fill-white text-white" />}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn("truncate text-[11px] font-semibold leading-tight", isPlaying ? "text-white" : "text-white/85")} style={{ fontFamily: "var(--font-cinematic)" }}>
                          {song.title}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-[9px] text-white/55">{song.singers}</p>
                          {isPlaying && (
                            <span className="flex items-end gap-px" style={{ height: "8px" }}>
                              {[0, 1, 2].map((b) => (
                                <span key={b} className="w-px rounded-sm bg-white/60" style={{ height: "60%", animation: `waveBar 0.6s ease-in-out ${b * 0.12}s infinite alternate` }} />
                              ))}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {pageSongs.length > 0 && pageSets.length > 0 && <div className="h-px bg-white/8" />}

          {/* Sets */}
          {pageSets.length > 0 && (
            <div>
              <p
                className="mb-3 text-[9px] uppercase tracking-[0.28em] text-white/55"
                style={{ fontFamily: "var(--font-cinematic)" }}
              >
                Location
              </p>
              <div className="flex flex-col gap-2">
                {pageSets.map((set) => (
                  <button
                    key={set.id}
                    type="button"
                    onClick={() => openSet(set.id)}
                    className="group flex items-center gap-2.5 rounded-xl border border-transparent px-2 py-1.5 text-left transition-all hover:border-white/15 hover:bg-white/5"
                  >
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/15">
                      <Image src={set.image} alt={set.name} fill className="object-cover" sizes="32px" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="truncate text-[11px] font-semibold text-white/90 group-hover:text-white"
                        style={{ fontFamily: "var(--font-cinematic)" }}
                      >
                        {set.name}
                      </p>
                      <p
                        className="text-[9px] text-white/55"
                        style={{ fontFamily: "var(--font-screenplay)" }}
                      >
                        {set.slug}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Written by */}
          {(() => {
            const writer = crew[0];
            return (
              <div>
                <div className="h-px bg-white/8 mb-4" />
                <p
                  className="mb-3 text-[9px] uppercase tracking-[0.28em] text-white/55"
                  style={{ fontFamily: "var(--font-cinematic)" }}
                >
                  Written By
                </p>
                <div className="flex items-center gap-2.5 rounded-xl p-1.5">
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
                    <Image src={writer.image} alt={writer.name} fill className="object-cover object-top" sizes="36px" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-white/85" style={{ fontFamily: "var(--font-cinematic)" }}>
                      {writer.name}
                    </p>
                    <p className="mt-0.5 truncate text-[9px] text-white/50" style={{ fontFamily: "var(--font-screenplay)" }}>
                      {writer.role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          <MoonWidget
            scriptHour={scriptTime?.hour}
            scriptTimeLabel={scriptTime?.label}
          />
        </div>
    </div>
  );
}
