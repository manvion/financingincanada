"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ImageGallery({
  images,
  title,
}: {
  images: { url: string; alt?: string | null }[];
  title: string;
}) {
  const [active, setActive] = React.useState(0);
  const list = images.length ? images : [{ url: "/placeholder.jpg", alt: title }];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-secondary">
        <Image
          src={list[active].url}
          alt={list[active].alt ?? title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
      </div>
      {list.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border-2 transition-all",
                active === i ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `${title} thumbnail ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
