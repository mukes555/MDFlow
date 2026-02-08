import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import content from "@/data/content.json";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  keywords: content.meta.keywords,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: content.meta.ogTitle,
    description: content.meta.description,
    type: "website",
    siteName: "MDFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: content.meta.ogTitle,
    description: content.meta.description,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf9f7",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MDFlow",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (browser-based)",
  description: content.meta.description,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Markdown to PDF conversion",
    "Markdown to DOCX conversion",
    "Markdown to HTML conversion",
    "Mermaid diagram rendering",
    "Live preview",
    "100% client-side processing",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
