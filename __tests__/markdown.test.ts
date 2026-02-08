import { parseMarkdown, getSampleMarkdown } from "../src/lib/markdown";

describe("markdown utilities", () => {
  describe("getSampleMarkdown", () => {
    it("returns a non-empty string", () => {
      const sample = getSampleMarkdown();
      expect(typeof sample).toBe("string");
      expect(sample.length).toBeGreaterThan(0);
    });

    it("contains expected markdown elements", () => {
      const sample = getSampleMarkdown();
      expect(sample).toContain("# ");
      expect(sample).toContain("## ");
      expect(sample).toContain("```mermaid");
      expect(sample).toContain("- ");
    });

    it("contains multiple mermaid diagrams", () => {
      const sample = getSampleMarkdown();
      const matches = sample.match(/```mermaid/g);
      expect(matches).not.toBeNull();
      expect(matches!.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("parseMarkdown", () => {
    it("converts headings to HTML", () => {
      const result = parseMarkdown("# Hello World");
      expect(result).toContain("<h1");
      expect(result).toContain("Hello World");
    });

    it("converts bold text", () => {
      const result = parseMarkdown("This is **bold** text");
      expect(result).toContain("<strong>bold</strong>");
    });

    it("converts code blocks with language class", () => {
      const result = parseMarkdown("```js\nconst x = 1;\n```");
      expect(result).toContain("<pre>");
      expect(result).toContain('<code class="language-js">');
    });

    it("converts mermaid blocks to mermaid containers", () => {
      const result = parseMarkdown("```mermaid\ngraph TD\n  A-->B\n```");
      expect(result).toContain("mermaid-container");
      expect(result).toContain('class="mermaid"');
    });

    it("escapes HTML in mermaid blocks", () => {
      const result = parseMarkdown("```mermaid\ngraph TD\n  A[<script>]-->B\n```");
      expect(result).toContain("&lt;script&gt;");
      expect(result).not.toContain("<script>");
    });

    it("converts tables to HTML tables", () => {
      const md = "| Col1 | Col2 |\n|------|------|\n| A | B |";
      const result = parseMarkdown(md);
      expect(result).toContain("<table>");
      expect(result).toContain("<th>");
    });

    it("converts blockquotes", () => {
      const result = parseMarkdown("> This is a quote");
      expect(result).toContain("<blockquote>");
    });

    it("converts lists", () => {
      const result = parseMarkdown("- Item 1\n- Item 2\n- Item 3");
      expect(result).toContain("<ul>");
      expect(result).toContain("<li>");
    });

    it("handles empty input", () => {
      const result = parseMarkdown("");
      expect(result).toBe("");
    });

    it("converts links", () => {
      const result = parseMarkdown("[Click here](https://example.com)");
      expect(result).toContain("<a");
      expect(result).toContain("https://example.com");
    });

    it("does not mutate global state between calls", () => {
      const r1 = parseMarkdown("# First");
      const r2 = parseMarkdown("## Second");
      expect(r1).toContain("<h1");
      expect(r2).toContain("<h2");
      expect(r1).not.toContain("<h2");
    });
  });
});
