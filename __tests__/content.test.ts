import content from "../src/data/content.json";

describe("content.json", () => {
  it("has meta section with required fields", () => {
    expect(content.meta).toBeDefined();
    expect(content.meta.title).toBeTruthy();
    expect(content.meta.description).toBeTruthy();
  });

  it("has nav section", () => {
    expect(content.nav.brand).toBeTruthy();
    expect(content.nav.cta).toBeTruthy();
  });

  it("has hero section with all required fields", () => {
    expect(content.hero).toBeDefined();
    expect(content.hero.title).toBeTruthy();
    expect(content.hero.subtitle).toBeTruthy();
    expect(content.hero.cta).toBeTruthy();
    expect(content.hero.tagline).toBeTruthy();
  });

  it("has features array with correct structure", () => {
    expect(Array.isArray(content.features)).toBe(true);
    expect(content.features.length).toBeGreaterThanOrEqual(4);
    content.features.forEach((feature) => {
      expect(feature.title).toBeTruthy();
      expect(feature.description).toBeTruthy();
    });
  });

  it("has formats array with PDF, DOCX, and HTML", () => {
    expect(Array.isArray(content.formats)).toBe(true);
    const names = content.formats.map((f) => f.name);
    expect(names).toContain("PDF");
    expect(names).toContain("DOCX");
    expect(names).toContain("HTML");
  });

  it("has steps with 3 entries", () => {
    expect(content.steps).toHaveLength(3);
    content.steps.forEach((step) => {
      expect(step.number).toBeTruthy();
      expect(step.title).toBeTruthy();
      expect(step.description).toBeTruthy();
    });
  });

  it("has footer section", () => {
    expect(content.footer).toBeDefined();
    expect(content.footer.tagline).toBeTruthy();
    expect(content.footer.note).toBeTruthy();
  });
});
