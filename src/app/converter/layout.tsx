import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown to PDF Converter Online — Export with Mermaid Diagrams | MDFlow",
  description:
    "Convert Markdown to PDF, DOCX, or HTML with live Mermaid diagrams. Free browser-based converter with real-time preview, smart page breaks, and no file uploads.",
  alternates: {
    canonical: "/converter",
  },
  openGraph: {
    title: "Online Markdown to PDF Converter with Mermaid Support | MDFlow",
    description:
      "Convert Markdown to PDF, DOCX, or HTML with live Mermaid diagrams. Free browser-based converter with real-time preview, smart page breaks, and no file uploads.",
    type: "website",
    siteName: "MDFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Markdown to PDF Converter with Mermaid Support | MDFlow",
    description:
      "Convert Markdown to PDF, DOCX, or HTML with live Mermaid diagrams. Free browser-based converter — no sign-up required.",
  },
};

export default function ConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
