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
          ? "rounded-none border-white/22 bg-black/55"
          : "rounded-lg border-white/10 bg-white/[0.02]",
      )}
    >
      <p
        className={cn(
          "mb-0.5 text-[8px] font-bold uppercase tracking-[0.18em]",
          industrial ? "text-[#8eb9a8]/90" : "text-amber-200/55",
        )}
        style={{ fontFamily: industrial ? "var(--font-industrial)" : undefined }}
      >
        {label}
      </p>
      <p
        className="text-[10px] leading-snug text-white/78"
        style={{ fontFamily: industrial ? "var(--font-industrial)" : "var(--font-screenplay)" }}
      >
        {value}
      </p>
    </div>
  );
}

/** Fixed strip: “Characters”, name, role, one-liner only — everything below scrolls. */
export function CharacterIdentityHeader({
  name,
  role,
  dossier,
  heading = "h2",
  showCharactersLabel = true,
  className = "",
  uppercaseTitle = true,
}: {
  name: string;
  role: string;
  dossier: CharacterDossier;
  heading?: "h1" | "h2";
  showCharactersLabel?: boolean;
  className?: string;
  /** False for dedicated profile pages — title case reads more cinematic. */
  uppercaseTitle?: boolean;
}) {
  const TitleTag = heading;
  const titleClasses =
    heading === "h1"
      ? cn(
          "mb-1 text-[clamp(2.75rem,6vw,4.75rem)] font-semibold leading-[0.95] tracking-[0.04em] text-white sm:mb-2 sm:tracking-[0.06em]",
          uppercaseTitle && "uppercase",
        )
      : cn(
          "mb-2 text-5xl font-extrabold leading-none text-white xl:text-6xl",
          uppercaseTitle && "uppercase",
        );

  return (
    <div className={className}>
      {showCharactersLabel && (
        <p
          className="mb-3 text-[10px] uppercase tracking-[0.35em] text-white/35 xl:mb-3"
          style={{ fontFamily: "var(--font-cinematic)" }}
        >
          Characters
        </p>
      )}
      <TitleTag
        className={titleClasses}
        style={{
          fontFamily: "var(--font-cinematic)",
          textShadow: heading === "h1" ? "0 2px 40px rgba(0,0,0,0.45), 0 0 80px rgba(251,191,36,0.06)" : undefined,
        }}
      >
        {name}
      </TitleTag>
      <p
        className={
          heading === "h1"
            ? "mb-4 text-xs uppercase tracking-[0.2em] text-white/45 sm:text-sm"
            : "mb-4 text-sm uppercase tracking-[0.2em] text-white/50"
        }
        style={{ fontFamily: "var(--font-cinematic)" }}
      >
        {role}
      </p>
      <blockquote
        className={
          heading === "h1"
            ? "mb-0 max-w-2xl border-l-2 border-amber-200/35 pl-5 text-base italic leading-relaxed text-white/68"
            : "mb-0 max-w-xl border-l-2 border-amber-200/30 pl-3 text-xs italic leading-relaxed text-white/65 sm:text-sm"
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
          industrial ? "text-[#8eb9a8]/85" : "text-white/45",
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
          industrial ? "text-[#8eb9a8]/85" : "text-white/45",
        )}
        style={{ fontFamily: industrial ? mono : "var(--font-cinematic)" }}
      >
        {industrial ? "▼ arc vector (chronological)" : "Arc summary"}
      </p>
      <div
        className="flex flex-col gap-2 text-[10px] leading-snug text-white/72 sm:flex-row sm:flex-wrap sm:items-center"
        style={{ fontFamily: industrial ? mono : "var(--font-screenplay)" }}
      >
        <span className="text-white/88">{dossier.arcSummary.start}</span>
        <span className={cn("hidden sm:inline", industrial ? "text-[#8eb9a8]/45" : "text-amber-200/40")}>
          &gt;&gt;
        </span>
        <span className="text-white/88">{dossier.arcSummary.middle}</span>
        <span className={cn("hidden sm:inline", industrial ? "text-[#8eb9a8]/45" : "text-amber-200/40")}>
          &gt;&gt;
        </span>
        <span className="text-white/88">{dossier.arcSummary.end}</span>
      </div>
    </div>
  );
}
