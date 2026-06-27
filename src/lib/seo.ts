import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const desc = description ?? SITE.description;
  const url = `${SITE.url}${path}`;
  const ogImage = image ?? `${SITE.url}/og-default.png`;

  return {
    title: fullTitle,
    description: desc,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    email: SITE.email,
    areaServed: "CA",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "ON",
      addressCountry: "CA",
    },
    sameAs: [
      "https://linkedin.com/company/financing-in-canada",
      "https://facebook.com/financingincanada",
    ],
  };
}
