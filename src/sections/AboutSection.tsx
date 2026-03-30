"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { songs } from "@/data/songs";
import { characters } from "@/data/characters";
import { saveTheCatBeats, sceneRules, dialogueRules, valueShiftExamples } from "@/data/writing-rules";
import { cn } from "@/lib/utils";

function Body({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="space-y-4 text-sm leading-relaxed text-white/80"
      style={{ fontFamily: "var(--font-screenplay)" }}
    >
      {children}
    </div>
  );
}

function AboutCollapsible({
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
    <div className="mb-2 rounded-xl border border-white/10 bg-white/[0.03]" data-section={id}>
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
      {open && (
        <div className="border-t border-white/8 px-3 pb-3 pt-1">{children}</div>
      )}
    </div>
  );
}

const LOGLINE =
  "On her first day at a beauty-obsessed high school, a scentless teen discovers she can awaken the hidden light in others—but when a manipulator twists the truth and turns her against the one person who believed in her, she must reclaim that truth to restore a fading world.";

const CORE_LINE =
  "Rose doesn’t bloom—she helps the world remember how.";

export function AboutSection({ openCharacter }: { openCharacter?: (id: string) => void } = {}) {
  return (
    <section
      id="about"
      className="relative flex min-h-0 h-screen w-screen shrink-0 overflow-hidden bg-black"
    >
      <div className="relative flex h-full w-[40%] shrink-0 overflow-hidden">
        <aside
          className="flex w-11 shrink-0 flex-col items-center gap-2 border-r border-white/10 bg-black/65 py-6 md:w-12"
          aria-label="Core cast"
        >
          <p
            className="mb-1 max-w-[2.75rem] text-center text-[7px] uppercase leading-tight tracking-[0.14em] text-white/35 md:text-[8px]"
            style={{ fontFamily: "var(--font-cinematic)" }}
          >
            Cast
          </p>
          <div className="flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto px-1 pb-4" style={{ scrollbarWidth: "none" }}>
            {characters.map((c) => {
              const face = (
                <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-white/18">
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    className="object-cover object-top"
                    sizes="28px"
                  />
                </div>
              );
              if (openCharacter) {
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => openCharacter(c.id)}
                    className="rounded-full transition-transform hover:scale-105 focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-200/50"
                    aria-label={`Open ${c.name}`}
                  >
                    {face}
                  </button>
                );
              }
              return (
                <div key={c.id} className="rounded-full" title={c.name}>
                  {face}
                </div>
              );
            })}
          </div>
        </aside>
        <div className="relative min-w-0 flex-1">
          <Image
            src="https://picsum.photos/seed/flower-about/900/1200"
            alt="FLOWER"
            fill
            className="object-cover object-center"
            sizes="36vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/90" />
        </div>
      </div>

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pl-8 pr-10 pt-12 xl:pr-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/40" />

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="relative shrink-0 border-b border-white/10 pb-6">
            <p
              className="mb-3 text-[10px] uppercase tracking-[0.35em] text-white/35"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              About
            </p>
            <h1
              className="mb-2 text-5xl font-extrabold uppercase leading-none text-white xl:text-6xl"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              The film
            </h1>
            <p
              className="mb-4 text-sm uppercase tracking-[0.2em] text-white/50"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              FLOWER
            </p>
            <blockquote
              className="mb-0 max-w-xl border-l-2 border-amber-200/30 pl-3 text-xs italic leading-relaxed text-white/65 sm:text-sm"
              style={{ fontFamily: "var(--font-screenplay)" }}
            >
              {LOGLINE}
            </blockquote>
            <p
              className="mt-4 max-w-xl text-[11px] font-semibold leading-relaxed text-amber-100/80"
              style={{ fontFamily: "var(--font-cinematic)" }}
            >
              {CORE_LINE}
            </p>
          </div>

          <div
            className="min-h-0 flex-1 overflow-y-auto pr-2 pb-16 pt-4"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="max-w-xl space-y-2">
              <AboutCollapsible id="theme" title="Theme" defaultOpen>
                <Body>
                  <ul className="list-inside list-disc space-y-2">
                    <li>True worth comes from within, not from performance</li>
                    <li>Belonging is not earned through conformity</li>
                    <li>Truth can be hidden by perception—but never erased</li>
                    <li>Love is belief made visible</li>
                  </ul>
                </Body>
              </AboutCollapsible>

              <AboutCollapsible id="world" title="World description" defaultOpen>
                <Body>
                  <p>
                    A stylized school-world where flowers represent identity and value, scent determines
                    status, and beauty is structured, ranked, and controlled.
                  </p>
                  <p>
                    Visual arc: glowing, curated perfection gives way to something expressive and organic as
                    presence reawakens.
                  </p>
                </Body>
              </AboutCollapsible>

              <AboutCollapsible id="power" title="Power system (Presence)" defaultOpen>
                <Body>
                  <p>
                    Rose&apos;s ability is not scent and not external decoration. It is emotional awakening—
                    presence. Light spreads, people reconnect to themselves, and the environment responds.
                  </p>
                  <p className="font-semibold text-white/90">
                    Rule: she doesn&apos;t give power—she reveals it.
                  </p>
                </Body>
              </AboutCollapsible>

              <AboutCollapsible id="characters_ab" title="Main characters (overview)">
                <Body>
                  <p><strong className="text-white/90">Rose</strong> — Protagonist; scentless; arc from insecure to self-accepting to awakening others; power Presence.</p>
                  <p><strong className="text-white/90">Lemon</strong> — Love interest / catalyst; playful outsider; arc belief, doubt, loss, restoration.</p>
                  <p><strong className="text-white/90">Daisy</strong> — Best friend / moral pivot; kind conformist; fit in, question, choose truth.</p>
                  <p><strong className="text-white/90">Narcissa</strong> — Social ideal; perfection; control, crack, release.</p>
                  <p><strong className="text-white/90">Nettles</strong> — Enforcer; intimidating; dominance to uncertainty to softening.</p>
                  <p><strong className="text-white/90">Goldenrod</strong> — Villain (control); beauty must be structured and owned.</p>
                  <p><strong className="text-white/90">Iris (Spin Doctor)</strong> — Villain (manipulation); people believe stories, not truth.</p>
                </Body>
              </AboutCollapsible>

              <AboutCollapsible id="songs" title="Song list">
                <ul className="list-inside list-decimal space-y-2 text-sm text-white/80" style={{ fontFamily: "var(--font-screenplay)" }}>
                  {songs.map((s) => (
                    <li key={s.id}>
                      <span className="text-white/90">{s.title}</span>
                      {" — "}
                      {s.singers}
                      {s.placement ? ` (${s.placement})` : ""}
                    </li>
                  ))}
                </ul>
              </AboutCollapsible>

              <AboutCollapsible id="structure" title="Story structure (15 beats)">
                <Body>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Act 1</p>
                  <ul className="mb-3 list-inside list-disc text-white/75">
                    <li>Opening Image — Rose arrives</li>
                    <li>Theme Stated — every flower is lovely</li>
                    <li>Set-Up — world and characters</li>
                    <li>Catalyst — humiliation</li>
                    <li>Debate — fit in vs Lemon</li>
                    <li>Break Into Two — chooses Lemon</li>
                  </ul>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Act 2A</p>
                  <ul className="mb-3 list-inside list-disc text-white/75">
                    <li>B Story — love begins</li>
                    <li>Fun and Games — glowing woods and waterfall</li>
                    <li>Midpoint — Bloom Ceremony (false victory)</li>
                  </ul>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Act 2B</p>
                  <ul className="mb-3 list-inside list-disc text-white/75">
                    <li>Bad Guys Close In — manipulation</li>
                    <li>All Is Lost — betrayal</li>
                    <li>Dark Night — Rose returns to waterfall</li>
                  </ul>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Act 3</p>
                  <ul className="list-inside list-disc text-white/75">
                    <li>Break Into Three — Daisy reveals truth</li>
                    <li>Finale — restore Lemon, awaken world</li>
                    <li>Final Image — transformed school</li>
                  </ul>
                </Body>
              </AboutCollapsible>

              <AboutCollapsible id="moments" title="Key story moments">
                <Body>
                  <p><strong>Waterfall (discovery)</strong> — first presence, emotional opening, duet.</p>
                  <p><strong>Bloom Ceremony</strong> — Narcissa performs; Rose flowers publicly.</p>
                  <p><strong>Betrayal</strong> — Iris twists Lemon&apos;s words; Rose believes he feared her.</p>
                  <p><strong>Daisy reveal</strong> — truth breaks conformity.</p>
                  <p><strong>Waterfall return</strong> — transformation; Red Magic (Rose solo).</p>
                  <p><strong>Climax</strong> — Rose restores Lemon; chain-reaction awakening.</p>
                </Body>
              </AboutCollapsible>

              <AboutCollapsible id="stc" title="Save the Cat (15 beats — craft reference)">
                <Body>
                  <p className="mb-3 text-white/60">
                    Use the script workspace to mark beat completion. Warn when a beat has no scenes, thin conflict, or off-theme turns.
                  </p>
                  <ul className="space-y-3 text-[12px] leading-relaxed text-white/75">
                    {saveTheCatBeats.map((b) => (
                      <li key={b.id}>
                        <span className="font-semibold text-white/90">{b.label}</span>
                        {" "}
                        <span className="text-white/45">({b.targetRange})</span>
                        <br />
                        {b.purpose} — <em className="text-white/55">{b.mustDo}</em>
                      </li>
                    ))}
                  </ul>
                </Body>
              </AboutCollapsible>

              <AboutCollapsible id="mckee" title="McKee rules (scene pressure)">
                <Body>
                  <p className="mb-2 text-white/60">Scene checks from the writing cockpit:</p>
                  <ul className="mb-4 list-inside list-disc space-y-1 text-white/75">
                    {sceneRules.slice(0, 4).map((r) => (
                      <li key={r.id}><strong>{r.headline}</strong> — {r.detail}</li>
                    ))}
                  </ul>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/50">Dialogue / subtext</p>
                  <ul className="list-inside list-disc space-y-1 text-white/75">
                    {dialogueRules.slice(0, 5).map((r) => (
                      <li key={r.id}>{r.label}: {r.test}</li>
                    ))}
                  </ul>
                </Body>
              </AboutCollapsible>

              <AboutCollapsible id="value_shifts" title="Value shift system">
                <Body>
                  <p>Track greater → lesser (or reverse) per scene. Examples:</p>
                  <ul className="list-inside list-disc space-y-1">
                    {valueShiftExamples.map((ex) => (
                      <li key={ex}>{ex}</li>
                    ))}
                  </ul>
                </Body>
              </AboutCollapsible>

              <AboutCollapsible id="taglines" title="Tagline options">
                <ul className="list-inside list-disc space-y-2 text-white/80">
                  <li>To flower is to become.</li>
                  <li>You don&apos;t have to fit in to come alive.</li>
                  <li>What you are is enough.</li>
                </ul>
              </AboutCollapsible>

              <AboutCollapsible id="numbers" title="By the numbers">
                <p
                  className="text-sm leading-relaxed text-white/80"
                  style={{ fontFamily: "var(--font-screenplay)" }}
                >
                  {songs.length} songs in score plan · 15 Save the Cat beats · {characters.length} core roles · Feature
                  animated musical (target runtime TBD)
                </p>
                <p className="mt-2 text-[11px] text-white/45">
                  Full screenplay pages in the Script section currently mirror a prior drafting shell; replace with
                  FLOWER acts, beat markers, scene blocks, and song inserts as you write.
                </p>
              </AboutCollapsible>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
