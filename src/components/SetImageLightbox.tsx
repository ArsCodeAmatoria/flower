"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";

export function SetImageLightbox({
  src,
  alt,
  open,
  onClose,
}: {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onKey]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[5000] flex cursor-default items-center justify-center bg-black/88 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-3 top-3 z-[2] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-zinc-900/80 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-zinc-800 sm:right-5 sm:top-5"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
      >
        <X className="size-5" />
      </button>
      <div
        className="relative z-[1] h-[min(92dvh,928px)] w-full max-w-[min(96vw,1232px)] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>
    </div>,
    document.body,
  );
}
