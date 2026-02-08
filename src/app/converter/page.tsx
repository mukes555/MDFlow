"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  FileText,
  Eye,
  PenLine,
  Columns2,
  ArrowLeft,
  Loader2,
  Check,
  X,
  ClipboardPaste,
  RotateCcw,
  FileType2,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { parseMarkdown, getSampleMarkdown } from "@/lib/markdown";

type ExportFormat = "pdf" | "docx" | "html";
type ViewMode = "edit" | "preview" | "split";

const EXPORT_ITEMS: {
  format: ExportFormat;
  label: string;
  ext: string;
  icon: React.ElementType;
}[] = [
  { format: "pdf", label: "PDF", ext: ".pdf", icon: FileText },
  { format: "docx", label: "Word", ext: ".docx", icon: FileType2 },
  { format: "html", label: "HTML", ext: ".html", icon: Globe },
];

const VIEW_MODES: { mode: ViewMode; icon: React.ElementType; label: string }[] = [
  { mode: "edit", icon: PenLine, label: "Editor" },
  { mode: "split", icon: Columns2, label: "Split" },
  { mode: "preview", icon: Eye, label: "Preview" },
];

export default function ConverterPage() {
  const [markdown, setMarkdown] = useState(getSampleMarkdown);
  const [renderedHtml, setRenderedHtml] = useState(() =>
    parseMarkdown(getSampleMarkdown())
  );
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  // On small screens, force out of split mode to avoid unusable 50/50 layout
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches && viewMode === "split") {
        setViewMode("preview");
      }
    };
    handler(mq); // check on mount
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [viewMode]);
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [exported, setExported] = useState<ExportFormat | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState("document");
  const previewRef = useRef<HTMLDivElement>(null);

  // Parse markdown on change
  useEffect(() => {
    setRenderedHtml(parseMarkdown(markdown));
  }, [markdown]);

  // Sync rendered HTML into preview div via ref so that unrelated state
  // updates (exporting, exported, etc.) never reset the DOM and destroy
  // mermaid-rendered SVGs. Also re-runs when viewMode changes because
  // switching to "edit" unmounts the preview div — when switching back
  // a fresh empty div mounts and needs to be populated.
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.innerHTML = renderedHtml;
    }
  }, [renderedHtml, viewMode]);

  // Render mermaid diagrams using v11 API
  useEffect(() => {
    if (!previewRef.current) return;

    const render = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          darkMode: false,
          theme: "base",
          themeVariables: {
            // Core colors
            background: "#ffffff",
            primaryColor: "#e8f0e7",
            primaryTextColor: "#1c1917",
            primaryBorderColor: "#a9c4a6",
            secondaryColor: "#f3f1ed",
            secondaryTextColor: "#1c1917",
            secondaryBorderColor: "#d0e0ce",
            tertiaryColor: "#faf9f7",
            tertiaryTextColor: "#1c1917",
            tertiaryBorderColor: "#e3e1dc",
            lineColor: "#78716c",
            textColor: "#1c1917",
            // Node / flowchart
            mainBkg: "#e8f0e7",
            nodeBorder: "#a9c4a6",
            nodeTextColor: "#1c1917",
            clusterBkg: "#f3f1ed",
            clusterBorder: "#e3e1dc",
            titleColor: "#1c1917",
            edgeLabelBackground: "#ffffff",
            // Sequence diagram
            actorBkg: "#e8f0e7",
            actorBorder: "#a9c4a6",
            actorTextColor: "#1c1917",
            actorLineColor: "#a8a29e",
            signalColor: "#1c1917",
            signalTextColor: "#1c1917",
            labelBoxBkgColor: "#ffffff",
            labelBoxBorderColor: "#a9c4a6",
            labelTextColor: "#1c1917",
            loopTextColor: "#1c1917",
            activationBorderColor: "#a9c4a6",
            activationBkgColor: "#e8f0e7",
            sequenceNumberColor: "#ffffff",
            // Notes
            noteBkgColor: "#f5f0e6",
            noteBorderColor: "#d4c4a4",
            noteTextColor: "#44403c",
            // Class diagram
            classText: "#1c1917",
            // Font
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: "14px",
          },
          themeCSS: `
            .actor { fill: #e8f0e7 !important; stroke: #a9c4a6 !important; }
            .actor-line { stroke: #a8a29e !important; }
            text.actor > tspan { fill: #1c1917 !important; }
            .messageLine0, .messageLine1 { stroke: #78716c !important; }
            .messageText { fill: #1c1917 !important; }
            .labelBox { fill: #ffffff !important; stroke: #a9c4a6 !important; }
            .labelText, .labelText > tspan { fill: #1c1917 !important; }
            .loopText, .loopText > tspan { fill: #1c1917 !important; }
            .loopLine { stroke: #a9c4a6 !important; }
            .activation0, .activation1, .activation2 { fill: #e8f0e7 !important; stroke: #a9c4a6 !important; }
            .note { fill: #f5f0e6 !important; stroke: #d4c4a4 !important; }
            .noteText, .noteText > tspan { fill: #44403c !important; }
            rect.rect { fill: #ffffff !important; stroke: #e3e1dc !important; }
            .relationshipLine { stroke: #78716c !important; }
            .entityBox { fill: #e8f0e7 !important; stroke: #a9c4a6 !important; }
            .attributeBoxOdd { fill: #f3f1ed !important; }
            .attributeBoxEven { fill: #ffffff !important; }
          `,
          flowchart: {
            useMaxWidth: false,
            htmlLabels: true,
            curve: "basis",
            padding: 15,
          },
          sequence: {
            useMaxWidth: false,
            diagramMarginX: 30,
            diagramMarginY: 20,
            actorMargin: 80,
            width: 180,
            height: 55,
            boxMargin: 10,
            boxTextMargin: 8,
            noteMargin: 15,
            messageMargin: 40,
            mirrorActors: true,
          },
          class: {
            useMaxWidth: true,
          },
        });

        const els = previewRef.current?.querySelectorAll<HTMLElement>(".mermaid");
        if (!els) return;

        for (let i = 0; i < els.length; i++) {
          const el = els[i];
          if (el.dataset.rendered === "true") continue;

          const source = el.textContent || "";
          if (!source.trim()) continue;

          try {
            const id = `mmd-${Date.now()}-${i}`;
            const { svg } = await mermaid.render(id, source);
            el.innerHTML = svg;
            el.dataset.rendered = "true";
          } catch {
            el.innerHTML =
              '<p style="color:#b45309;font-size:13px;margin:0">Unable to render this diagram. Check the syntax.</p>';
            el.dataset.rendered = "true";
          }
        }
      } catch {
        // mermaid not available yet
      }
    };

    const timer = setTimeout(render, 150);
    return () => clearTimeout(timer);
  }, [renderedHtml, viewMode]);

  // File upload handler
  const handleFileUpload = useCallback((file: File) => {
    if (!/\.(md|markdown|txt)$/i.test(file.name)) return;
    setFileName(file.name.replace(/\.(md|markdown|txt)$/i, ""));
    const reader = new FileReader();
    reader.onload = (e) => setMarkdown(e.target?.result as string);
    reader.readAsText(file);
  }, []);

  // Drag & drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  // Export handler — lazy-loads exporters to reduce initial bundle
  // CRITICAL: Captures mermaid SVG data BEFORE setExporting() triggers a
  // React re-render that would destroy the live SVGs in the DOM.
  const handleExport = useCallback(async (format: ExportFormat) => {
    if (!markdown.trim()) return;

    // Snapshot mermaid data while SVGs are still in the live DOM
    let pdfSnapshot: HTMLElement | null = null;
    let mermaidImages: Map<number, { data: Uint8Array; w: number; h: number }> | null = null;

    if (previewRef.current) {
      const { prepareSnapshot, captureMermaidImages } = await import("@/lib/exporters");
      if (format === "pdf") {
        pdfSnapshot = await prepareSnapshot(previewRef.current);
      } else if (format === "docx") {
        mermaidImages = await captureMermaidImages(previewRef.current);
      }
    }

    // NOW safe to update state (re-render won't affect our captured data)
    setExporting(format);
    setExported(null);

    try {
      const { exportToPdf, exportToDocx, exportToHtml } = await import("@/lib/exporters");
      if (format === "pdf" && pdfSnapshot) {
        await exportToPdf(pdfSnapshot, `${fileName}.pdf`);
      } else if (format === "docx") {
        await exportToDocx(renderedHtml, `${fileName}.docx`, mermaidImages ?? undefined);
      } else if (format === "html") {
        exportToHtml(renderedHtml, `${fileName}.html`);
      }
      setExported(format);
      setTimeout(() => setExported(null), 2500);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExporting(null);
    }
  }, [markdown, fileName, renderedHtml]);

  return (
    <div className="h-screen flex flex-col bg-[#faf9f7] overflow-hidden">
      {/* Header */}
      <header
        className="h-12 border-b border-stone-200/70 bg-white flex items-center justify-between px-3 flex-shrink-0 z-50"
        role="banner"
      >
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="flex items-center gap-2 text-stone-400 hover:text-stone-600 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-500 rounded"
            aria-label="Back to MDFlow home"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <div className="w-5 h-5 rounded bg-sage-500 flex items-center justify-center" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" />
              </svg>
            </div>
            <span className="text-sm font-medium text-stone-700 hidden sm:inline">MDFlow</span>
          </Link>

          <div className="w-px h-5 bg-stone-200 mx-1" aria-hidden="true" />

          <div className="flex items-center gap-0.5 p-0.5 bg-stone-100 rounded-lg" role="tablist" aria-label="View mode">
            {VIEW_MODES.map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                role="tab"
                aria-selected={viewMode === mode}
                aria-label={`${label} view`}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sage-500 ${
                  mode === "split" ? "hidden sm:flex" : ""
                } ${
                  viewMode === mode
                    ? "bg-white text-stone-700 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                <Icon className="w-3 h-3" aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1" role="toolbar" aria-label="Export options">
          {EXPORT_ITEMS.map(({ format, label, icon: Icon }) => {
            const isActive = exporting === format;
            const isDone = exported === format;
            return (
              <button
                key={format}
                onClick={() => handleExport(format)}
                disabled={exporting !== null || !markdown.trim()}
                aria-label={`Export as ${label}`}
                className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sage-500 disabled:opacity-30 disabled:cursor-not-allowed ${
                  isDone
                    ? "bg-sage-50 text-sage-700 border border-sage-200"
                    : "bg-stone-900 text-white hover:bg-stone-800 hover:shadow-md active:scale-[0.97]"
                }`}
              >
                {isActive ? (
                  <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                ) : isDone ? (
                  <Check className="w-3 h-3" aria-hidden="true" />
                ) : (
                  <Icon className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main content */}
      <div
        className="flex-1 flex overflow-hidden relative"
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        role="main"
      >
        {/* Drag overlay */}
        <div
          className={`absolute inset-2 z-40 bg-sage-50/90 backdrop-blur-sm flex items-center justify-center border-2 border-dashed border-sage-400 rounded-xl transition-opacity duration-200 ${
            isDragOver ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          aria-live="polite"
        >
          <div className="text-center">
            <Upload className="w-8 h-8 text-sage-500 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm font-medium text-sage-700">Drop your .md file here</p>
          </div>
        </div>

        {/* Editor panel */}
        {(viewMode === "edit" || viewMode === "split") && (
          <section
            className={`flex flex-col ${viewMode === "split" ? "w-1/2 border-r border-stone-200/70" : "w-full"}`}
            aria-label="Markdown editor"
          >
            <div className="h-9 border-b border-stone-100 flex items-center justify-between px-3 bg-white flex-shrink-0">
              <div className="flex items-center gap-2 text-[11px] text-stone-500">
                <PenLine className="w-3 h-3" aria-hidden="true" />
                <span className="font-medium">Markdown</span>
                <span className="text-stone-300" aria-hidden="true">&middot;</span>
                <span>{markdown.split("\n").length} lines</span>
              </div>
              <div className="flex items-center gap-0.5">
                <label className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-stone-500 hover:text-sage-600 hover:bg-sage-50 cursor-pointer transition-colors focus-within:outline-2 focus-within:outline-sage-500">
                  <Upload className="w-3 h-3" aria-hidden="true" />
                  <span className="hidden sm:inline">Upload</span>
                  <input
                    type="file"
                    accept=".md,.markdown,.txt"
                    className="sr-only"
                    aria-label="Upload markdown file"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload(f);
                    }}
                  />
                </label>
                <button
                  onClick={() => navigator.clipboard.readText().then((t) => t && setMarkdown(t))}
                  className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-stone-500 hover:text-sage-600 hover:bg-sage-50 transition-colors focus-visible:outline-2 focus-visible:outline-sage-500"
                  aria-label="Paste from clipboard"
                >
                  <ClipboardPaste className="w-3 h-3" aria-hidden="true" />
                  <span className="hidden sm:inline">Paste</span>
                </button>
                <button
                  onClick={() => { setMarkdown(getSampleMarkdown()); setFileName("document"); }}
                  className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-stone-500 hover:text-warm-600 hover:bg-warm-50 transition-colors focus-visible:outline-2 focus-visible:outline-sage-500"
                  aria-label="Load sample document"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  <span className="hidden sm:inline">Sample</span>
                </button>
                {markdown && (
                  <button
                    onClick={() => { setMarkdown(""); setFileName("document"); }}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-stone-500 hover:text-red-500 hover:bg-red-50 transition-colors focus-visible:outline-2 focus-visible:outline-sage-500"
                    aria-label="Clear editor"
                  >
                    <X className="w-3 h-3" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="flex-1 w-full bg-white text-stone-700 p-5 font-mono text-[13px] resize-none outline-none placeholder:text-stone-300 leading-relaxed focus:ring-0"
              style={{ caretColor: "#5c7c5a" }}
              placeholder="Type or paste your Markdown here..."
              spellCheck={false}
              aria-label="Markdown input"
            />
          </section>
        )}

        {/* Preview panel */}
        {(viewMode === "preview" || viewMode === "split") && (
          <section
            className={`flex flex-col ${viewMode === "split" ? "w-1/2" : "w-full"}`}
            aria-label="Document preview"
          >
            <div className="h-9 border-b border-stone-100 flex items-center justify-between px-3 bg-white flex-shrink-0">
              <div className="flex items-center gap-2 text-[11px] text-stone-500">
                <Eye className="w-3 h-3" aria-hidden="true" />
                <span className="font-medium">Preview</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-white">
              {markdown.trim() ? (
                <div className="py-8 px-6">
                  <div
                    ref={previewRef}
                    className="markdown-preview"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-stone-100 to-stone-50 border border-stone-200/60 flex items-center justify-center mb-4 shadow-sm">
                    <FileText className="w-6 h-6 text-stone-300" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium text-stone-500 mb-1">Nothing to preview yet</p>
                  <p className="text-xs text-stone-400">Start typing, upload a file, or load the sample</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
