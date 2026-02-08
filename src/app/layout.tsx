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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: content.meta.title,
    template: "%s | MDFlow",
  },
  description: content.meta.description,
  keywords: content.meta.keywords,
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: content.meta.ogTitle,
    description: content.meta.description,
    type: "website",
    siteName: "MDFlow",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: content.meta.ogTitle,
    description: content.meta.description,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf9f7",
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MDFlow",
    url: SITE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (browser-based)",
    browserRequirements: "Requires a modern web browser with JavaScript enabled",
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
      "Mermaid diagram rendering in exports",
      "Live real-time preview",
      "100% client-side processing",
      "No sign-up required",
      "Smart page breaks for diagrams",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can MDFlow convert Mermaid diagrams to PDF?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MDFlow renders Mermaid flowcharts, sequence diagrams, class diagrams, and Gantt charts as high-resolution images embedded directly in the exported PDF. Smart page breaks ensure diagrams are never split across pages.",
        },
      },
      {
        "@type": "Question",
        name: "Is MDFlow free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Completely free. No sign-up, no paywall, no usage limits. MDFlow runs 100% in your browser — your files never leave your device.",
        },
      },
      {
        "@type": "Question",
        name: "What formats can MDFlow export to?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MDFlow exports Markdown to three formats: PDF (print-ready with smart page breaks), DOCX (Microsoft Word with embedded images), and HTML (self-contained with live Mermaid rendering).",
        },
      },
      {
        "@type": "Question",
        name: "Does MDFlow upload my files to a server?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. MDFlow processes everything client-side in your browser. Your Markdown files are never uploaded to any server. There is zero tracking and zero data collection.",
        },
      },
    ],
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
