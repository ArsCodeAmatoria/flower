import type { CharacterDossier } from "@/data/character-dossiers";

export function CoreField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
      <p className="mb-0.5 text-[8px] font-bold uppercase tracking-[0.18em] text-amber-200/55">{label}</p>
      <p className="text-[10px] leading-snug text-white/75" style={{ fontFamily: "var(--font-screenplay)" }}>
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
}: {
  name: string;
  role: string;
  dossier: CharacterDossier;
  heading?: "h1" | "h2";
  showCharactersLabel?: boolean;
  className?: string;
}) {
  const TitleTag = heading;
  const titleClasses =
    heading === "h1"
      ? "mb-1 text-5xl font-extrabold uppercase leading-none text-white sm:text-6xl lg:text-7xl"
      : "mb-2 text-5xl font-extrabold uppercase leading-none text-white xl:text-6xl";

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
      <TitleTag className={titleClasses} style={{ fontFamily: "var(--font-cinematic)" }}>
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
            ? "mb-0 max-w-2xl border-l-2 border-amber-200/30 pl-4 text-sm italic leading-relaxed text-white/65"
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
export function CharacterCoreArcBlock({ dossier, className = "" }: { dossier: CharacterDossier; className?: string }) {
  return (
    <div className={className}>
      <p
        className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/45"
        style={{ fontFamily: "var(--font-cinematic)" }}
      >
        Core identity
      </p>
      <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <CoreField label="Want" value={dossier.coreIdentity.want} />
        <CoreField label="Lie" value={dossier.coreIdentity.lie} />
        <CoreField label="Truth" value={dossier.coreIdentity.truth} />
        <CoreField label="Mask" value={dossier.coreIdentity.mask} />
        <CoreField label="Voice" value={dossier.coreIdentity.voice} />
        <CoreField label="Contradiction" value={dossier.coreIdentity.contradiction} />
      </div>

      <p
        className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/45"
        style={{ fontFamily: "var(--font-cinematic)" }}
      >
        Arc summary
      </p>
      <div
        className="flex flex-col gap-2 text-[10px] leading-snug text-white/70 sm:flex-row sm:flex-wrap sm:items-center"
        style={{ fontFamily: "var(--font-screenplay)" }}
      >
        <span className="text-white/85">{dossier.arcSummary.start}</span>
        <span className="hidden text-amber-200/40 sm:inline">→</span>
        <span className="text-white/85">{dossier.arcSummary.middle}</span>
        <span className="hidden text-amber-200/40 sm:inline">→</span>
        <span className="text-white/85">{dossier.arcSummary.end}</span>
      </div>
    </div>
  );
}
