"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export type UploadedImage = { url: string; alt?: string };

export function ImageUploader({
  value,
  onChange,
  multiple = true,
  className,
}: {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  multiple?: boolean;
  className?: string;
}) {
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const next: UploadedImage[] = [];
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        next.push({ url: data.url, alt: file.name });
      }
      onChange(multiple ? [...value, ...next] : next.slice(0, 1));
    } catch (err) {
      toast({ variant: "destructive", title: "Upload failed", description: err instanceof Error ? err.message : "" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((img, i) => (
          <div key={img.url} className="group relative aspect-square overflow-hidden rounded-xl border bg-secondary">
            <Image src={img.url} alt={img.alt ?? ""} fill sizes="160px" className="object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-md bg-navy/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                <GripVertical className="h-3 w-3" /> Cover
              </span>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-muted-foreground transition-colors hover:border-gold hover:text-gold",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
          <span className="text-xs font-medium">{uploading ? "Uploading…" : "Add image"}</span>
        </button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        JPG, PNG, WebP or AVIF up to 6 MB. The first image is used as the cover.
      </p>
    </div>
  );
}
