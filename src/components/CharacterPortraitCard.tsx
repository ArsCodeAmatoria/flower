"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { SetImageLightbox } from "@/components/SetImageLightbox";
import { cn } from "@/lib/utils";

export function CharacterPortraitCard({
  src,
  alt,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <Card
        className={cn(
          "relative h-[min(40dvh,320px)] w-full shrink-0 overflow-hidden rounded-xl border border-zinc-200/90 p-0 shadow-md",
          "lg:h-full lg:min-h-0 lg:w-[min(40%,420px)] lg:max-w-none",
          className,
        )}
      >
        <div className="absolute inset-0">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 380px"
            priority={priority}
          />
          <button
            type="button"
            className="absolute inset-0 z-10 cursor-zoom-in border-0 bg-transparent p-0"
            aria-label={`View ${alt} larger`}
            onClick={() => setLightboxOpen(true)}
          />
        </div>
      </Card>
      <SetImageLightbox src={src} alt={alt} open={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </>
  );
}
