# MDFlow

Convert Markdown files with Mermaid diagrams to **PDF**, **DOCX**, and **HTML** — free, private, and entirely in your browser.

## Why MDFlow?

Most Markdown converters break when they hit Mermaid code blocks. MDFlow renders flowcharts, sequence diagrams, class diagrams, and Gantt charts as crisp images embedded directly in your exports. No server uploads, no sign-up, no limits.

| Feature | Details |
|---------|---------|
| Mermaid support | Flowcharts, sequence, class, Gantt — rendered in all export formats |
| PDF export | Smart page breaks that never split diagrams or tables |
| DOCX export | Word-compatible with Mermaid diagrams as high-res embedded images |
| HTML export | Self-contained file with live Mermaid rendering via CDN |
| Privacy | 100% client-side — files never leave your browser |
| Live preview | Real-time split-pane editor with instant rendering |

## Tech Stack

- **Framework:** Next.js 15 (App Router, static export)
- **UI:** React 19, Tailwind CSS 3
- **Markdown:** Marked v15
- **Diagrams:** Mermaid v11
- **PDF:** jsPDF + html2canvas
- **DOCX:** docx v9
- **Icons:** Lucide React
- **Testing:** Jest + Testing Library

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Type check
npm run typecheck

# Production build
npm run build
```

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `NEXT_PUBLIC_SITE_URL` | Base URL for canonical links, sitemap, and structured data | `http://localhost:3000` |

Set this in your Vercel project settings (or `.env.local`) to your production domain:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/mdflow)

1. Push to GitHub
2. Import in Vercel
3. Set `NEXT_PUBLIC_SITE_URL` in environment variables
4. Deploy

## Project Structure

```
src/
  app/
    page.tsx            # Landing page
    layout.tsx          # Root layout, metadata, JSON-LD
    globals.css         # All styles (Tailwind + markdown preview)
    converter/
      page.tsx          # Main converter app
      layout.tsx        # Converter-specific metadata
    sitemap.ts          # Auto-generated sitemap
    robots.ts           # Auto-generated robots.txt
  lib/
    markdown.ts         # Markdown parsing (Marked v15)
    exporters.ts        # PDF, DOCX, HTML export logic
  data/
    content.json        # All UI text (SEO-optimized)
__tests__/
  markdown.test.ts      # Markdown utility tests
  content.test.ts       # Content JSON validation tests
```

## How It Works

1. **Parse** — Markdown is parsed with Marked v15. Mermaid code blocks are converted to `<div class="mermaid-container">` wrappers.
2. **Render** — Mermaid v11 renders diagrams as SVGs in the live preview.
3. **Export** — Before export, mermaid SVGs are rasterized to PNG (via canvas) and embedded in the output format. This happens *before* React state updates to prevent DOM destruction.

### Key Technical Decisions

- **Snapshot-before-state pattern**: Export captures mermaid SVGs before `setExporting()` triggers a re-render, preventing the React lifecycle from destroying live diagram DOM nodes.
- **Ref-based DOM sync**: Preview uses `ref.innerHTML` instead of `dangerouslySetInnerHTML` so unrelated state changes don't reset rendered mermaid diagrams.
- **Element-aware page breaks**: PDF export detects mermaid containers, tables, code blocks, and blockquotes, then repositions page breaks to avoid splitting them.
- **Lazy-loaded exporters**: The export module (~400KB) is dynamically imported only when the user clicks an export button, keeping initial load at 124KB.

## License

MIT
