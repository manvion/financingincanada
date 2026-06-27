"use client";

import * as React from "react";
import { Check, Link2, Linkedin, Twitter, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = React.useState(false);
  const enc = encodeURIComponent;

  const links = [
    { label: "LinkedIn", Icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: "Twitter", Icon: Twitter, href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}` },
    { label: "Facebook", Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      {links.map(({ label, Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={copy}
        aria-label="Copy link"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
          copied ? "border-emerald-400 text-emerald-500" : "text-muted-foreground hover:border-gold hover:text-gold"
        )}
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
