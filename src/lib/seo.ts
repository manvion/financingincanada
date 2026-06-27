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

  return {
    title: fullTitle,
    description: desc,
    alternates: {
      canonical: url,
      // Canada-targeted hreflang signals
      languages: { "en-CA": url, "x-default": url },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
        },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      countryName: "Canada",
      type,
      // When a page provides its own image, use it; otherwise the branded
      // app/opengraph-image route supplies the default automatically.
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: fullTitle }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      ...(image ? { images: [image] } : {}),
    },
  };
}

const ADDRESS = {
  "@type": "PostalAddress",
  addressCountry: "CA",
};

const AREA_SERVED = {
  "@type": "Country",
  name: "Canada",
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.name,
    description: SITE.description,
    url: SITE.url,
    email: SITE.email,
    slogan: SITE.tagline,
    areaServed: AREA_SERVED,
    serviceArea: AREA_SERVED,
    address: ADDRESS,
    knowsLanguage: ["en-CA", "fr-CA"],
    sameAs: [
      "https://linkedin.com/company/financing-in-canada",
      "https://facebook.com/financingincanada",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: "en-CA",
    publisher: { "@id": `${SITE.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/equipment?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}
