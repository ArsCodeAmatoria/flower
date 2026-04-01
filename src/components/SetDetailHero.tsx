"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SetImageLightbox } from "@/components/SetImageLightbox";

export function SetDetailHero({
  imageSrc,
  imageAlt,
  prev,
  next,
}: {
  imageSrc: string;
  imageAlt: string;
  prev: { id: string; name: string } | null;
  next: { id: string; name: string } | null;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <div className="absolute inset-0 overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-200/90 shadow-sm">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          sizes="(min-width: 1024px) calc(100vw - 13rem - 3rem), calc(100vw - 2rem)"
          priority
        />
        <button
          type="button"
          className="absolute inset-0 z-10 cursor-zoom-in rounded-2xl border-0 bg-transparent p-0"
          aria-label="Open full image"
          onClick={() => setLightboxOpen(true)}
        />
        <nav
          className="pointer-events-auto absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-2 sm:px-3"
          aria-label="Previous and next location"
        >
          {prev ? (
            <Link
              href={`/sets/${prev.id}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/90 bg-white/95 text-zinc-800 shadow-md backdrop-blur-sm transition-colors hover:bg-white sm:h-11 sm:w-11"
              aria-label={`Previous: ${prev.name}`}
            >
              <ChevronLeft className="size-5 stroke-[1.5]" />
            </Link>
          ) : (
            <span className="w-10 sm:w-11" aria-hidden />
          )}
          {next ? (
            <Link
              href={`/sets/${next.id}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/90 bg-white/95 text-zinc-800 shadow-md backdrop-blur-sm transition-colors hover:bg-white sm:h-11 sm:w-11"
              aria-label={`Next: ${next.name}`}
            >
              <ChevronRight className="size-5 stroke-[1.5]" />
            </Link>
          ) : (
            <span className="w-10 sm:w-11" aria-hidden />
          )}
        </nav>
      </div>
      <SetImageLightbox
        src={imageSrc}
        alt={imageAlt}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
