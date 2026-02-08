import { Marked, type Tokens } from "marked";

const SAMPLE_MD = `# Welcome to MDFlow

A powerful Markdown converter with **Mermaid** diagram support.

## Features

- **PDF Export** -- High-quality PDF with proper typography
- **DOCX Export** -- Microsoft Word compatible documents
- **HTML Export** -- Self-contained HTML files
- Full **Mermaid** diagram rendering

## Example Code

\`\`\`javascript
function convertMarkdown(input) {
  const html = marked.parse(input);
  return html;
}
\`\`\`

## Mermaid Diagram

\`\`\`mermaid
graph LR
    A[Upload .md] --> B[Parse Markdown]
    B --> C[Render Preview]
    C --> D{Choose Format}
    D --> E[PDF]
    D --> F[DOCX]
    D --> G[HTML]
\`\`\`

## Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Browser
    participant MDFlow
    User->>Browser: Upload .md file
    Browser->>MDFlow: Parse content
    MDFlow->>Browser: Render preview
    User->>MDFlow: Click export
    MDFlow->>Browser: Generate file
    Browser->>User: Download
\`\`\`

## Table Example

| Feature | Supported |
|---------|-----------|
| Headers | Yes |
| Lists | Yes |
| Code blocks | Yes |
| Tables | Yes |
| Mermaid | Yes |
| Images | Yes |

> **Tip:** Drag and drop a \`.md\` file or paste your Markdown content to get started.

---

*Made with MDFlow -- free, fast, and private.*
`;

export function getSampleMarkdown(): string {
  return SAMPLE_MD;
}

/**
 * Parse Markdown to HTML, converting mermaid code blocks into
 * dedicated containers that can be rendered by mermaid.js.
 */
export function parseMarkdown(md: string): string {
  const instance = new Marked();

  instance.use({
    renderer: {
      code({ text, lang }: Tokens.Code): string {
        const language = (lang || "").trim();
        if (language === "mermaid") {
          const escaped = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
          return `<div class="mermaid-container"><pre class="mermaid">${escaped}</pre></div>\n`;
        }
        const code = text.replace(/\n$/, "") + "\n";
        const escapedCode = code
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
        if (language) {
          const safeLang = language.replace(/"/g, "&quot;");
          return `<pre><code class="language-${safeLang}">${escapedCode}</code></pre>\n`;
        }
        return `<pre><code>${escapedCode}</code></pre>\n`;
      },
    },
    gfm: true,
    breaks: false,
  });

  return instance.parse(md) as string;
}

