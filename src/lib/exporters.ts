import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Document,
  Paragraph,
  TextRun,
  ImageRun,
  HeadingLevel,
  Packer,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";

// ── PDF Export ───────────────────────────────────────────────────────────────

/**
 * Convert an SVG element to a PNG data URL using the browser's native
 * SVG rendering pipeline (SVG → Image → Canvas → PNG).
 * html2canvas cannot render inline SVGs, so we bypass it entirely.
 */
async function svgToPngDataUrl(
  svgEl: SVGSVGElement,
  scale = 2
): Promise<{ dataUrl: string; width: number; height: number }> {
  const svgClone = svgEl.cloneNode(true) as SVGSVGElement;
  const rect = svgEl.getBoundingClientRect();
  const w = Math.ceil(rect.width) || 800;
  const h = Math.ceil(rect.height) || 600;

  svgClone.setAttribute("width", String(w));
  svgClone.setAttribute("height", String(h));
  if (!svgClone.getAttribute("xmlns")) {
    svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }

  // Serialize SVG to a base64 data URI
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgClone);
  const svgBase64 = btoa(unescape(encodeURIComponent(svgStr)));
  const dataUri = `data:image/svg+xml;base64,${svgBase64}`;

  // Load the SVG as an image (browser renders it natively)
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUri;
  });

  // Draw to canvas at specified scale for quality
  const canvas = document.createElement("canvas");
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(scale, scale);
  ctx.drawImage(img, 0, 0, w, h);

  return { dataUrl: canvas.toDataURL("image/png"), width: w, height: h };
}

/**
 * Pre-rasterize mermaid SVGs in the clone by converting live SVGs to PNG <img> tags.
 * This ensures html2canvas (used for the full-page capture) only sees <img> elements.
 */
async function rasterizeMermaidSvgs(
  liveEl: HTMLElement,
  cloneEl: HTMLElement
): Promise<void> {
  const liveContainers = liveEl.querySelectorAll(".mermaid-container");
  const cloneContainers = cloneEl.querySelectorAll(".mermaid-container");

  for (let i = 0; i < liveContainers.length; i++) {
    const liveCont = liveContainers[i] as HTMLElement;
    const cloneCont = cloneContainers[i] as HTMLElement | undefined;
    if (!cloneCont) continue;

    const svg = liveCont.querySelector("svg") as SVGSVGElement | null;
    if (!svg) continue;

    try {
      const { dataUrl } = await svgToPngDataUrl(svg);
      cloneCont.innerHTML = `<img src="${dataUrl}" style="max-width:100%;height:auto;display:block;margin:0 auto;" />`;
    } catch {
      // leave clone container as-is on failure
    }
  }
}

/**
 * Prepare a snapshot of the preview element with mermaid SVGs pre-rasterized to PNGs.
 * Must be called BEFORE any React state update that could re-render and destroy live SVGs.
 */
export async function prepareSnapshot(sourceElement: HTMLElement): Promise<HTMLElement> {
  const clone = sourceElement.cloneNode(true) as HTMLElement;
  await rasterizeMermaidSvgs(sourceElement, clone);
  return clone;
}

/**
 * Export a pre-rasterized snapshot element to a paginated A4 PDF.
 * The snapshot should already have mermaid SVGs converted to PNG <img> tags
 * (via `prepareSnapshot()`). This avoids timing issues with React re-renders.
 *
 * Uses element-aware page breaking so diagrams, tables, code blocks, and
 * blockquotes are never split across pages.
 */
export async function exportToPdf(
  snapshot: HTMLElement,
  filename = "document.pdf"
): Promise<void> {
  snapshot.className = "pdf-render-target";
  document.body.appendChild(snapshot);

  try {
    // Collect vertical ranges of elements that should not be split.
    // Positions are relative to the snapshot's top edge.
    const snapshotRect = snapshot.getBoundingClientRect();
    const noBreak: { top: number; bottom: number }[] = [];
    snapshot
      .querySelectorAll(".mermaid-container, table, pre, blockquote")
      .forEach((el) => {
        const r = el.getBoundingClientRect();
        noBreak.push({
          top: r.top - snapshotRect.top,
          bottom: r.bottom - snapshotRect.top,
        });
      });

    const canvas = await html2canvas(snapshot, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 794,
    });

    // html2canvas renders at `scale` times the CSS pixel size.
    const canvasScale = canvas.height / snapshot.scrollHeight;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const contentW = pageW - margin * 2;
    const contentH = pageH - margin * 2;
    const sliceH = (canvas.height * contentH) / ((canvas.height * contentW) / canvas.width);

    let srcY = 0;
    let pageNum = 0;

    while (srcY < canvas.height) {
      if (pageNum > 0) pdf.addPage();

      const remaining = canvas.height - srcY;
      let thisSlice = Math.min(sliceH, remaining);

      // Check if any no-break element is split by this page boundary.
      // If so, move the boundary up to just before that element.
      if (thisSlice < remaining) {
        const breakY = srcY + thisSlice; // canvas-pixel y where the cut falls
        for (const el of noBreak) {
          const elTop = el.top * canvasScale;
          const elBottom = el.bottom * canvasScale;
          // Element straddles the break line
          if (elTop < breakY && elBottom > breakY && elTop > srcY) {
            // Move break to just above this element (4px gap)
            thisSlice = elTop - srcY - 4 * canvasScale;
            break;
          }
        }
        // Safety: ensure we always advance at least 10% of a page
        if (thisSlice < sliceH * 0.1) {
          thisSlice = Math.min(sliceH, remaining);
        }
      }

      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = Math.ceil(thisSlice);
      const ctx = sliceCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        ctx.drawImage(
          canvas,
          0, Math.floor(srcY), canvas.width, Math.ceil(thisSlice),
          0, 0, canvas.width, Math.ceil(thisSlice)
        );
      }

      const imgData = sliceCanvas.toDataURL("image/png");
      const imgH = (thisSlice * contentW) / canvas.width;
      pdf.addImage(imgData, "PNG", margin, margin, contentW, imgH);

      srcY += thisSlice;
      pageNum++;
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(snapshot);
  }
}

// ── DOCX Export ──────────────────────────────────────────────────────────────

interface DocElement {
  type:
    | "heading"
    | "paragraph"
    | "list-item"
    | "code"
    | "blockquote"
    | "table"
    | "hr"
    | "mermaid-image";
  level?: number;
  content: string;
  rows?: string[][];
}

/**
 * Capture each rendered mermaid diagram in the preview as a PNG image buffer.
 * Uses SVG native rendering (not html2canvas) for reliable output.
 * Must be called BEFORE any React state update that could destroy live SVGs.
 * Returns a map of diagram index -> { data, width, height }.
 */
export async function captureMermaidImages(
  previewEl?: HTMLElement
): Promise<Map<number, { data: Uint8Array; w: number; h: number }>> {
  const result = new Map<number, { data: Uint8Array; w: number; h: number }>();
  if (!previewEl) return result;

  const containers = previewEl.querySelectorAll(".mermaid-container");
  for (let i = 0; i < containers.length; i++) {
    const container = containers[i] as HTMLElement;
    const svg = container.querySelector("svg") as SVGSVGElement | null;
    if (!svg) continue;

    try {
      const { dataUrl, width, height } = await svgToPngDataUrl(svg);
      // Convert data URL to Uint8Array
      const res = await fetch(dataUrl);
      const buf = await res.arrayBuffer();
      result.set(i, { data: new Uint8Array(buf), w: width, h: height });
    } catch {
      // skip on failure
    }
  }
  return result;
}

/** Walk the parsed HTML and produce a flat list of document elements. */
function htmlToDocElements(html: string): DocElement[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const elements: DocElement[] = [];
  let mermaidIdx = 0;

  function walk(node: Node): void {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (el.classList.contains("mermaid-container")) {
      elements.push({ type: "mermaid-image", content: "", level: mermaidIdx++ });
      return;
    }
    if (/^h[1-6]$/.test(tag)) {
      elements.push({ type: "heading", level: parseInt(tag[1]), content: el.textContent || "" });
    } else if (tag === "p") {
      elements.push({ type: "paragraph", content: el.textContent || "" });
    } else if (tag === "li") {
      elements.push({ type: "list-item", content: el.textContent || "" });
    } else if (tag === "pre") {
      elements.push({ type: "code", content: el.textContent || "" });
    } else if (tag === "blockquote") {
      elements.push({ type: "blockquote", content: el.textContent || "" });
    } else if (tag === "table") {
      const rows: string[][] = [];
      el.querySelectorAll("tr").forEach((tr) => {
        const cells: string[] = [];
        tr.querySelectorAll("th, td").forEach((td) =>
          cells.push(td.textContent || "")
        );
        rows.push(cells);
      });
      elements.push({ type: "table", content: "", rows });
    } else if (tag === "hr") {
      elements.push({ type: "hr", content: "" });
    } else {
      el.childNodes.forEach(walk);
    }
  }

  doc.body.childNodes.forEach(walk);
  return elements;
}

const HEADING_LEVELS: Record<number, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
  3: HeadingLevel.HEADING_3,
  4: HeadingLevel.HEADING_4,
  5: HeadingLevel.HEADING_5,
  6: HeadingLevel.HEADING_6,
};

/**
 * Export HTML content to a DOCX file.
 * Accepts an optional pre-captured mermaid diagram map (from `captureMermaidImages()`).
 */
export async function exportToDocx(
  html: string,
  filename = "document.docx",
  diagrams?: Map<number, { data: Uint8Array; w: number; h: number }>
): Promise<void> {
  const diagramMap = diagrams ?? new Map<number, { data: Uint8Array; w: number; h: number }>();
  const parsed = htmlToDocElements(html);
  const children: (Paragraph | Table)[] = [];

  for (const el of parsed) {
    switch (el.type) {
      case "heading":
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: el.content,
                bold: true,
                size: 28 + (6 - (el.level || 1)) * 4,
                font: "Calibri",
              }),
            ],
            heading: HEADING_LEVELS[el.level || 1],
            spacing: { before: 280, after: 120 },
          })
        );
        break;

      case "paragraph":
        children.push(
          new Paragraph({
            children: [new TextRun({ text: el.content, size: 24, font: "Calibri" })],
            spacing: { after: 120, line: 276 },
          })
        );
        break;

      case "list-item":
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `\u2022  ${el.content}`, size: 24, font: "Calibri" })],
            spacing: { after: 60 },
            indent: { left: 360 },
          })
        );
        break;

      case "code":
        children.push(
          new Paragraph({
            children: [new TextRun({ text: el.content, font: "Courier New", size: 20, color: "334155" })],
            spacing: { before: 120, after: 120 },
            border: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "d4d4d4" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "d4d4d4" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "d4d4d4" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "d4d4d4" },
            },
            shading: { fill: "f8f8f7" },
          })
        );
        break;

      case "blockquote":
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: el.content, italics: true, size: 24, color: "57534e", font: "Calibri" }),
            ],
            indent: { left: 480 },
            border: { left: { style: BorderStyle.SINGLE, size: 6, color: "5c7c5a" } },
            spacing: { before: 120, after: 120 },
          })
        );
        break;

      case "mermaid-image": {
        const img = diagramMap.get(el.level ?? 0);
        if (img) {
          const maxWidth = 550;
          const scale = img.w > maxWidth ? maxWidth / img.w : 1;
          children.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: img.data,
                  type: "png",
                  transformation: {
                    width: Math.round(img.w * scale),
                    height: Math.round(img.h * scale),
                  },
                }),
              ],
              spacing: { before: 200, after: 200 },
            })
          );
        } else {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "[Mermaid diagram — render in preview first]",
                  italics: true,
                  color: "9ca3af",
                  size: 22,
                  font: "Calibri",
                }),
              ],
              spacing: { before: 120, after: 120 },
            })
          );
        }
        break;
      }

      case "table":
        if (el.rows && el.rows.length > 0) {
          const colCount = el.rows[0].length;
          const colWidth = Math.floor(9000 / colCount);
          const rows = el.rows.map(
            (row, ri) =>
              new TableRow({
                children: row.map(
                  (cell) =>
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: cell, bold: ri === 0, size: 22, font: "Calibri" }),
                          ],
                        }),
                      ],
                      width: { size: colWidth, type: WidthType.DXA },
                      shading: ri === 0 ? { fill: "f5f5f4" } : undefined,
                    })
                ),
              })
          );
          children.push(new Table({ rows, width: { size: 9000, type: WidthType.DXA } }));
          children.push(new Paragraph({ children: [], spacing: { after: 120 } }));
        }
        break;

      case "hr":
        children.push(
          new Paragraph({
            children: [],
            border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "d4d4d4" } },
            spacing: { before: 240, after: 240 },
          })
        );
        break;
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}

// ── HTML Export ──────────────────────────────────────────────────────────────

/** Export rendered HTML as a standalone, self-contained HTML file. */
export function exportToHtml(html: string, filename = "document.html"): void {
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Document</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.75; color: #1c1917; max-width: 720px; margin: 0 auto;
      padding: 48px 24px; background: #faf9f7;
    }
    h1 { font-size: 1.875em; font-weight: 700; margin: 1.2em 0 0.6em; letter-spacing: -0.02em; }
    h2 { font-size: 1.375em; font-weight: 600; margin: 1.2em 0 0.5em; }
    h3 { font-size: 1.125em; font-weight: 600; margin: 1em 0 0.4em; }
    p { margin: 0.75em 0; color: #44403c; }
    strong { color: #1c1917; }
    a { color: #5c7c5a; }
    code { background: #f3f1ed; color: #b45309; padding: 2px 6px; border-radius: 4px; font-size: 0.875em; }
    pre { background: #292524; border-radius: 10px; padding: 18px; overflow-x: auto; margin: 1.25em 0; }
    pre code { background: none; color: #e7e5e4; padding: 0; font-size: 0.8125em; line-height: 1.7; }
    blockquote { border-left: 3px solid #5c7c5a; padding: 0.5em 1em; margin: 1em 0; background: #e8f0e7; border-radius: 0 8px 8px 0; }
    ul, ol { margin: 0.75em 0; padding-left: 1.75em; }
    li { margin: 0.35em 0; color: #44403c; }
    table { border-collapse: collapse; width: 100%; margin: 1.25em 0; font-size: 0.875em; }
    th, td { border: 1px solid #e3e1dc; padding: 10px 14px; text-align: left; }
    th { background: #f3f1ed; font-weight: 600; }
    img { max-width: 100%; border-radius: 8px; }
    hr { border: none; border-top: 1px solid #e3e1dc; margin: 2em 0; }
    .mermaid-container { margin: 1.25em 0; text-align: center; }
    .mermaid-container pre { background: transparent; padding: 0; margin: 0; border-radius: 0; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"><\/script>
  <script>mermaid.initialize({ startOnLoad: true, darkMode: false, theme: 'base', themeVariables: { background: '#ffffff', primaryColor: '#e8f0e7', primaryTextColor: '#1c1917', primaryBorderColor: '#a9c4a6', lineColor: '#78716c', secondaryColor: '#f3f1ed', textColor: '#1c1917', mainBkg: '#e8f0e7', actorBkg: '#e8f0e7', actorBorder: '#a9c4a6', actorTextColor: '#1c1917', signalColor: '#1c1917', signalTextColor: '#1c1917', noteBkgColor: '#f5f0e6', noteBorderColor: '#d4c4a4', noteTextColor: '#44403c', classText: '#1c1917', labelBoxBkgColor: '#ffffff' }, flowchart: { useMaxWidth: false }, sequence: { useMaxWidth: false }, class: { useMaxWidth: false } });<\/script>
</head>
<body>
${html}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: "text/html" });
  saveAs(blob, filename);
}
