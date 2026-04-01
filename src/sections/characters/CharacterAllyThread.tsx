"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Phone, Video } from "lucide-react";
import type { CharacterChatTheme } from "@/data/characters";
import type { CharacterChatLine } from "@/data/character-chats";
import { cn } from "@/lib/utils";

export interface AllyThreadParticipant {
  id: string;
  name: string;
  image: string;
}

export function CharacterAllyThread({
  viewerId,
  theme,
  lines,
  participants,
  compact = false,
}: {
  viewerId: string;
  theme: CharacterChatTheme;
  lines: CharacterChatLine[];
  participants: AllyThreadParticipant[];
  /** Tighter chrome for the industrial slide variant. */
  compact?: boolean;
}) {
  const byId = new Map(participants.map((p) => [p.id, p]));
  const subtitle = participants
    .map((p) => p.name.split(" ")[0])
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-100 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)]",
        compact && "rounded-lg shadow-md",
      )}
    >
      <header
        className={cn("flex items-center gap-2 px-2 py-2 sm:gap-3 sm:px-3 sm:py-2.5", compact && "py-1.5")}
        style={{
          background: theme.headerBg,
          color: theme.headerText,
        }}
      >
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/10 sm:size-9"
          aria-hidden
        >
          <ChevronLeft className="size-5 opacity-90" strokeWidth={1.75} />
        </span>
        <div className="relative flex shrink-0 -space-x-2">
          {participants.slice(0, 3).map((p) => (
            <div
              key={p.id}
              className="relative size-9 overflow-hidden rounded-full ring-2 ring-white/30 sm:size-10"
            >
              <Image src={p.image} alt="" fill className="object-cover object-top" sizes="40px" />
            </div>
          ))}
          {participants.length > 3 ? (
            <div
              className="relative z-10 flex size-9 items-center justify-center rounded-full bg-black/25 text-[10px] font-semibold ring-2 ring-white/30 sm:size-10"
              aria-hidden
            >
              +{participants.length - 3}
            </div>
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn("truncate text-sm font-semibold leading-tight sm:text-[15px]", compact && "text-xs")}>
            Allies
          </p>
          <p
            className={cn("truncate text-[11px] sm:text-xs", compact && "text-[10px]")}
            style={{ color: theme.headerSub }}
          >
            {subtitle}
          </p>
        </div>
        <div className="hidden shrink-0 items-center gap-1 sm:flex" aria-hidden>
          <span className="flex size-8 items-center justify-center rounded-full bg-black/10">
            <Video className="size-4 opacity-85" strokeWidth={1.75} />
          </span>
          <span className="flex size-8 items-center justify-center rounded-full bg-black/10">
            <Phone className="size-4 opacity-85" strokeWidth={1.75} />
          </span>
        </div>
      </header>

      <div
        className={cn(
          "relative max-h-[min(52vh,22rem)] min-h-[12rem] overflow-y-auto px-2.5 py-3 sm:max-h-[min(56vh,26rem)] sm:px-3 sm:py-4",
          compact && "max-h-[40vh] min-h-[10rem] py-2",
        )}
        style={{
          background: theme.wallpaper,
          scrollbarWidth: "thin",
        }}
      >
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {lines.map((line, i) => {
            const isSelf = line.fromId === viewerId;
            const sender = byId.get(line.fromId);
            const showTail =
              i === lines.length - 1 || lines[i + 1]?.fromId !== line.fromId;

            return (
              <div
                key={`${line.fromId}-${i}-${line.time}`}
                className={cn("flex gap-2", isSelf ? "flex-row-reverse" : "flex-row")}
              >
                {!isSelf && sender ? (
                  <Link
                    href={`/characters/${sender.id}`}
                    className={cn("shrink-0 self-end", compact && "self-end")}
                    title={`Open ${sender.name}`}
                  >
                    <div className="relative size-8 overflow-hidden rounded-full ring-1 ring-black/10 sm:size-9">
                      <Image
                        src={sender.image}
                        alt=""
                        fill
                        className="object-cover object-top"
                        sizes="36px"
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="w-8 shrink-0 sm:w-9" aria-hidden />
                )}

                <div className={cn("flex max-w-[min(100%,20rem)] flex-col", isSelf ? "items-end" : "items-start")}>
                  {!isSelf && sender ? (
                    <span
                      className="mb-0.5 pl-0.5 text-[10px] font-semibold sm:text-[11px]"
                      style={{ color: theme.accentDot }}
                    >
                      {sender.name.split(" ")[0]}
                    </span>
                  ) : null}
                  <div
                    className={cn(
                      "relative rounded-2xl px-2.5 py-1.5 text-[13px] leading-snug shadow-sm sm:px-3 sm:py-2 sm:text-[14px] sm:leading-relaxed",
                      showTail && (isSelf ? "rounded-br-sm" : "rounded-bl-sm"),
                    )}
                    style={{
                      background: isSelf ? theme.bubbleSelf : theme.bubblePeer,
                      color: isSelf ? theme.bubbleSelfText : theme.bubblePeerText,
                    }}
                  >
                    <p className="whitespace-pre-wrap">{line.text}</p>
                    <p
                      className="mt-1 text-right text-[9px] tabular-nums sm:text-[10px]"
                      style={{ color: theme.timestamp }}
                    >
                      {line.time}
                      {isSelf ? (
                        <>
                          {" "}
                          <span aria-hidden>✓✓</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer
        className={cn("flex items-center gap-2 border-t border-black/5 px-2 py-2 sm:px-3 sm:py-2.5", compact && "py-1.5")}
        style={{ background: theme.wallpaper }}
      >
        <div
          className="h-9 flex-1 rounded-full border px-3 text-left text-[12px] leading-9 sm:h-10 sm:text-[13px]"
          style={{
            background: theme.inputBg,
            borderColor: theme.inputBorder,
            color: theme.bubblePeerText,
            opacity: 0.85,
          }}
        >
          Message
        </div>
        <span
          className="size-9 shrink-0 rounded-full sm:size-10"
          style={{ background: theme.accentDot }}
          aria-hidden
        />
      </footer>
    </div>
  );
}
