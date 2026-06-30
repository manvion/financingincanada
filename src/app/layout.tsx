import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/components/providers";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  ...buildMetadata({}),
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "finance",
  keywords: [
    "equipment financing Canada",
    "equipment leasing Canada",
    "business equipment loans",
    "construction equipment financing",
    "truck financing Canada",
    "commercial equipment financing",
    "heavy equipment leasing",
    "sale leaseback Canada",
    // Province-level coverage
    "equipment financing Ontario",
    "equipment financing Alberta",
    "equipment financing British Columbia",
    "equipment financing Quebec",
    "equipment financing Manitoba",
    "equipment financing Saskatchewan",
    "equipment financing Nova Scotia",
    "equipment financing New Brunswick",
    // Major-market coverage
    "equipment financing Toronto",
    "equipment financing Calgary",
    "equipment financing Vancouver",
    "equipment financing Montreal",
    "equipment financing Edmonton",
    "equipment financing Winnipeg",
    "equipment financing Ottawa",
  ],
  icons: { icon: "/favicon.svg" },
  // Canada geo-targeting signals for search engines.
  other: {
    "geo.region": "CA",
    "geo.placename": "Canada",
    "distribution": "Canada",
    "coverage": "Canada",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1a3c" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" suppressHydrationWarning className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="min-h-screen font-sans">
        <Providers>{children}</Providers>
        <Script
          id="org-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd(), websiteJsonLd()]) }}
        />
      </body>
    </html>
  );
}
