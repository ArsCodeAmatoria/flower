import type { CharacterDossier } from "@/data/character-dossiers";
import { cn } from "@/lib/utils";

export function CoreField({
  label,
  value,
  industrial = false,
}: {
  label: string;
  value: string;
  industrial?: boolean;
}) {
  return (
    <div
      className={cn(
        "border px-3 py-2",
        industrial
          ? "rounded-none border-zinc-300 bg-zinc-100"
          : "rounded-lg border-zinc-200 bg-white",
      )}
    >
      <p
        className={cn(
          "mb-0.5 text-[8px] font-bold uppercase tracking-[0.18em]",
          industrial ? "text-emerald-700" : "text-red-700/90",
        )}
        style={{ fontFamily: industrial ? "var(--font-industrial)" : undefined }}
      >
        {label}
      </p>
      <p
        className="text-[10px] leading-snug text-zinc-800"
        style={{ fontFamily: industrial ? "var(--font-industrial)" : "var(--font-screenplay)" }}
      >
        {value}
      </p>
    </div>
  );
}

/** Fixed strip: “Characters”, name, role, one-liner. Use `compact` on profile pages to avoid scrolling. */
export function CharacterIdentityHeader({
  name,
  role,
  dossier,
  heading = "h2",
  showCharactersLabel = true,
  className = "",
  uppercaseTitle = true,
  compact = false,
}: {
  name: string;
  role: string;
  dossier: CharacterDossier;
  heading?: "h1" | "h2";
  showCharactersLabel?: boolean;
  className?: string;
  /** False for dedicated profile pages — title case reads more cinematic. */
  uppercaseTitle?: boolean;
  /** Tighter typography so the hero + profile fits one viewport without scrolling. */
  compact?: boolean;
}) {
  const TitleTag = heading;
  const titleClasses =
    heading === "h1"
      ? compact
        ? cn(
            "mb-0.5 text-[clamp(1.35rem,4.2vw,2.35rem)] font-semibold leading-[0.98] tracking-[0.04em] text-zinc-900",
            uppercaseTitle && "uppercase",
          )
        : cn(
            "mb-1 text-[clamp(2.75rem,6vw,4.75rem)] font-semibold leading-[0.95] tracking-[0.04em] text-zinc-900 sm:mb-2 sm:tracking-[0.06em]",
            uppercaseTitle && "uppercase",
          )
      : cn(
          "mb-2 text-5xl font-extrabold leading-none text-zinc-900 xl:text-6xl",
          uppercaseTitle && "uppercase",
        );

  return (
    <div className={cn(className, compact && "shrink-0")}>
      {showCharactersLabel && (
        <p
          className="mb-3 text-[10px] uppercase tracking-[0.35em] text-zinc-500 xl:mb-3"
          style={{ fontFamily: "var(--font-cinematic)" }}
        >
          Characters
        </p>
      )}
      <TitleTag
        className={titleClasses}
        style={{
          fontFamily: "var(--font-cinematic)",
          textShadow:
            heading === "h1" && !compact
              ? "0 1px 0 rgba(255,255,255,0.9), 0 2px 20px rgba(0,0,0,0.06)"
              : undefined,
        }}
      >
        {name}
      </TitleTag>
      <p
        className={
          heading === "h1"
            ? compact
              ? "mb-1.5 text-[10px] uppercase tracking-[0.2em] text-zinc-600"
              : "mb-4 text-xs uppercase tracking-[0.2em] text-zinc-600 sm:text-sm"
            : "mb-4 text-sm uppercase tracking-[0.2em] text-zinc-600"
        }
        style={{ fontFamily: "var(--font-cinematic)" }}
      >
        {role}
      </p>
      <blockquote
        className={
          heading === "h1"
            ? compact
              ? "mb-0 max-w-2xl border-l-2 border-red-400/70 pl-3 text-[11px] italic leading-snug text-zinc-700 line-clamp-2"
              : "mb-0 max-w-2xl border-l-2 border-red-400/70 pl-5 text-base italic leading-relaxed text-zinc-700"
            : "mb-0 max-w-xl border-l-2 border-red-400/60 pl-3 text-xs italic leading-relaxed text-zinc-700 sm:text-sm"
        }
        style={{ fontFamily: "var(--font-screenplay)" }}
      >
        {dossier.identityOneLiner}
      </blockquote>
    </div>
  );
}

/** Core identity + arc summary — place inside scroll region. */
export function CharacterCoreArcBlock({
  dossier,
  className = "",
  industrial = false,
}: {
  dossier: CharacterDossier;
  className?: string;
  industrial?: boolean;
}) {
  const mono = industrial ? "var(--font-industrial)" : undefined;
  return (
    <div className={className}>
      <p
        className={cn(
          "mb-2 text-[9px] font-bold uppercase tracking-[0.2em]",
          industrial ? "text-emerald-800" : "text-zinc-500",
        )}
        style={{ fontFamily: industrial ? mono : "var(--font-cinematic)" }}
      >
        {industrial ? "▼ core identity matrix" : "Core identity"}
      </p>
      <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <CoreField industrial={industrial} label="Want" value={dossier.coreIdentity.want} />
        <CoreField industrial={industrial} label="Lie" value={dossier.coreIdentity.lie} />
        <CoreField industrial={industrial} label="Truth" value={dossier.coreIdentity.truth} />
        <CoreField industrial={industrial} label="Mask" value={dossier.coreIdentity.mask} />
        <CoreField industrial={industrial} label="Voice" value={dossier.coreIdentity.voice} />
        <CoreField industrial={industrial} label="Contradiction" value={dossier.coreIdentity.contradiction} />
      </div>

      <p
        className={cn(
          "mb-2 text-[9px] font-bold uppercase tracking-[0.2em]",
          industrial ? "text-emerald-800" : "text-zinc-500",
        )}
        style={{ fontFamily: industrial ? mono : "var(--font-cinematic)" }}
      >
        {industrial ? "▼ arc vector (chronological)" : "Arc summary"}
      </p>
      <div
        className="flex flex-col gap-2 text-[10px] leading-snug text-zinc-700 sm:flex-row sm:flex-wrap sm:items-center"
        style={{ fontFamily: industrial ? mono : "var(--font-screenplay)" }}
      >
        <span className="text-zinc-900">{dossier.arcSummary.start}</span>
        <span className={cn("hidden sm:inline", industrial ? "text-emerald-600/80" : "text-red-600/70")}>
          &gt;&gt;
        </span>
        <span className="text-zinc-900">{dossier.arcSummary.middle}</span>
        <span className={cn("hidden sm:inline", industrial ? "text-emerald-600/80" : "text-red-600/70")}>
          &gt;&gt;
        </span>
        <span className="text-zinc-900">{dossier.arcSummary.end}</span>
      </div>
    </div>
  );
}
