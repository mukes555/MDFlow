"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import content from "@/data/content.json";

const featureIcons = [
  // Browser
  <svg key="browser" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></svg>,
  // Mermaid
  <svg key="mermaid" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3" /><path d="M12 8v4" /><circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><path d="M12 12l-6 2" /><path d="M12 12l6 2" /></svg>,
  // Formats
  <svg key="formats" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M9 15h6" /></svg>,
  // Preview
  <svg key="preview" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>,
  // Private
  <svg key="private" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  // No account
  <svg key="noaccount" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>,
];

export default function HomePage() {
  return (
    <div className="min-h-screen noise-bg">
      {/* Navigation */}
      <nav className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sage-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 7V4h16v3" />
              <path d="M9 20h6" />
              <path d="M12 4v16" />
            </svg>
          </div>
          <span className="font-semibold text-stone-800 tracking-tight">{content.nav.brand}</span>
        </Link>
        <Link
          href="/converter"
          className="text-sm font-medium text-sage-600 hover:text-sage-800 transition-colors flex items-center gap-1"
        >
          {content.nav.cta}
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-50 border border-sage-200 text-sage-600 text-xs font-medium mb-8 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-sage-400 animate-pulse" />
          {content.hero.tagline}
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-[3.25rem] font-bold tracking-tight text-stone-900 leading-[1.15] mb-5">
          {content.hero.title}
          <br />
          <span className="text-sage-600">{content.hero.titleAccent}</span>
        </h1>

        <p className="text-lg text-stone-600 max-w-xl mx-auto leading-relaxed mb-10">
          {content.hero.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/converter"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            {content.hero.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-stone-600 text-sm font-medium hover:text-stone-700 hover:bg-stone-100 transition-all"
          >
            {content.hero.secondary}
          </a>
        </div>
      </section>

      {/* Preview mockup */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="card overflow-hidden shadow-sm">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-stone-100 bg-stone-50/50">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
            <span className="ml-3 text-[11px] text-stone-400 font-mono">readme.md</span>
          </div>
          <div className="grid md:grid-cols-2 divide-x divide-stone-100">
            <div className="p-5 font-mono text-[13px] text-stone-500 leading-relaxed bg-white">
              <p><span className="text-stone-800 font-semibold"># Project Guide</span></p>
              <p className="mt-2.5">A quick overview of the <span className="text-stone-700">**architecture**</span>.</p>
              <p className="mt-3 text-sage-600">```mermaid</p>
              <p className="text-stone-400">graph LR</p>
              <p className="text-stone-400 pl-4">A[Markdown] --&gt; B[Parser]</p>
              <p className="text-stone-400 pl-4">B --&gt; C[PDF / DOCX / HTML]</p>
              <p className="text-sage-600">```</p>
              <p className="mt-3">| Format | Status |</p>
              <p>|--------|--------|</p>
              <p>| PDF    | Ready  |</p>
            </div>
            <div className="p-5 bg-stone-50/30">
              <h3 className="text-lg font-bold text-stone-800 mb-2">Project Guide</h3>
              <p className="text-sm text-stone-600 mb-4">A quick overview of the <strong className="text-stone-700">architecture</strong>.</p>
              <div className="bg-sage-50 border border-sage-200/60 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-3 text-xs">
                  <span className="px-2.5 py-1 bg-white rounded-md border border-sage-200 text-stone-600 font-medium shadow-sm">Markdown</span>
                  <span className="text-stone-300">&rarr;</span>
                  <span className="px-2.5 py-1 bg-white rounded-md border border-sage-200 text-stone-600 font-medium shadow-sm">Parser</span>
                  <span className="text-stone-300">&rarr;</span>
                  <span className="px-2.5 py-1 bg-white rounded-md border border-sage-200 text-stone-600 font-medium shadow-sm">PDF / DOCX / HTML</span>
                </div>
              </div>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-1.5 px-2 bg-stone-100 rounded-l font-medium text-stone-600">Format</th>
                    <th className="text-left py-1.5 px-2 bg-stone-100 rounded-r font-medium text-stone-600">Status</th>
                  </tr>
                </thead>
                <tbody className="text-stone-600">
                  <tr><td className="py-1.5 px-2">PDF</td><td className="py-1.5 px-2">Ready</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-stone-900 text-center mb-3 tracking-tight">Why MDFlow?</h2>
        <p className="text-sm text-stone-500 text-center mb-10 max-w-lg mx-auto">Everything you need to convert Markdown documents, nothing you don&apos;t.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.features.map((f, i) => (
            <div key={f.title} className="card group p-5 hover:border-sage-200 transition-all duration-300">
              <div className="w-9 h-9 rounded-lg bg-sage-50 border border-sage-200/60 flex items-center justify-center text-sage-600 mb-3 group-hover:bg-sage-100 group-hover:border-sage-300 transition-colors">
                {featureIcons[i]}
              </div>
              <h3 className="text-sm font-semibold text-stone-800 mb-1.5">{f.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-stone-900 text-center mb-3 tracking-tight">How it works</h2>
        <p className="text-sm text-stone-500 text-center mb-12 max-w-md mx-auto">Three steps. No sign-up. No server uploads.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {content.steps.map((s, i) => (
            <div key={s.number} className="text-center relative">
              {i < content.steps.length - 1 && (
                <div className="hidden md:block absolute top-5 left-[60%] w-[80%] border-t border-dashed border-stone-200" aria-hidden="true" />
              )}
              <div className="relative z-10 w-10 h-10 rounded-full bg-sage-50 border border-sage-200 text-sage-600 font-semibold text-sm flex items-center justify-center mx-auto mb-4">
                {s.number}
              </div>
              <h3 className="text-sm font-semibold text-stone-800 mb-1.5">{s.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formats */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-stone-900 text-center mb-3 tracking-tight">Export formats</h2>
        <p className="text-sm text-stone-500 text-center mb-10 max-w-md mx-auto">Each format is optimized for its use case.</p>
        <div className="space-y-3">
          {content.formats.map((f) => (
            <div key={f.name} className="card flex items-start gap-4 p-5 group hover:border-warm-200 transition-all duration-300">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-warm-50 border border-warm-200 flex items-center justify-center text-xs font-bold text-warm-600 tracking-wide group-hover:bg-warm-100 group-hover:border-warm-300 transition-colors">
                {f.name === "PDF" ? ".pdf" : f.name === "DOCX" ? ".docx" : ".html"}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-800 mb-0.5">{f.name}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
        <div className="card p-10 bg-gradient-to-br from-white to-sage-50/30">
          <h2 className="text-xl font-bold text-stone-900 mb-2">Ready to convert?</h2>
          <p className="text-sm text-stone-500 mb-6">No sign-up. No cost. Just open and start.</p>
          <Link
            href="/converter"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            Open converter
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FAQ — long-tail SEO */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-stone-900 text-center mb-3 tracking-tight">Frequently asked questions</h2>
        <p className="text-sm text-stone-500 text-center mb-10 max-w-md mx-auto">Common questions about converting Markdown to PDF with Mermaid diagrams.</p>
        <div className="space-y-3">
          {content.faq.map((item) => (
            <details key={item.q} className="card group p-5">
              <summary className="text-sm font-semibold text-stone-800 cursor-pointer list-none flex items-center justify-between gap-4">
                {item.q}
                <span className="flex-shrink-0 text-stone-400 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="text-sm text-stone-500 leading-relaxed mt-3 pt-3 border-t border-stone-100">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8 border-t border-stone-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-sage-500 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" />
              </svg>
            </div>
            <span className="text-xs text-stone-500">{content.footer.note}</span>
          </div>
          <p className="text-xs text-stone-400">{content.footer.tagline}</p>
        </div>
      </footer>
    </div>
  );
}
