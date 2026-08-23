import type { Metadata, Viewport } from "next";
import { Inter, Urbanist } from "next/font/google";
import "./globals.css";

import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import GlitchTransition from "@/components/GlitchTransition";
import { SITE } from "@/lib/site";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E62E0",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "real estate marketing",
    "real estate social media",
    "real estate video production",
    "real estate content agency",
    "listing photography",
    "Australia",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MarketingAgency",
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  telephone: SITE.phoneIntl,
  description: SITE.description,
  areaServed: { "@type": "Country", name: "Australia" },
  sameAs: [SITE.socials.instagram, SITE.socials.linkedin],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className={`${urbanist.variable} ${inter.variable}`}>
      <body className="bg-re-ivory text-re-ink antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <TopBar />
        <Header />
        <main className="pt-[var(--shell-h)]">{children}</main>
        <Footer />
        <WhatsAppFab />
        <GlitchTransition />
      </body>
    </html>
  );
}
