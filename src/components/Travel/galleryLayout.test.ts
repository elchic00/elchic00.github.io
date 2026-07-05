import { describe, it, expect } from "vitest";
import {
  getGalleryItemLayout,
  getTripPatternOffset,
  EDITORIAL_GALLERY_LAYOUTS,
  countLayoutsByCategory,
} from "./galleryLayout";

describe("galleryLayout", () => {
  describe("EDITORIAL_GALLERY_LAYOUTS", () => {
    it("has more than 6 layouts for varied rhythm", () => {
      expect(EDITORIAL_GALLERY_LAYOUTS.length).toBeGreaterThan(6);
    });

    it("includes all four layout categories: large, wide, tall, small", () => {
      const categories = countLayoutsByCategory();
      expect(categories.large).toBeGreaterThan(0);
      expect(categories.wide).toBeGreaterThan(0);
      expect(categories.tall).toBeGreaterThan(0);
      expect(categories.small).toBeGreaterThan(0);
    });

    it("has a balanced distribution - no single category dominates", () => {
      const categories = countLayoutsByCategory();
      const total = EDITORIAL_GALLERY_LAYOUTS.length;
      const values = Object.values(categories);
      for (const count of values) {
        expect(count / total).toBeLessThanOrEqual(0.5);
      }
    });

    // Masonry columns (CSS `columns-*` + `break-inside-avoid`), not CSS Grid —
    // variety comes from aspect ratio per item, not col/row spans. Grid with
    // mixed spans in row-major auto-flow left real, unfillable gaps even with
    // grid-flow-dense (confirmed visually 2026-07-04); masonry columns pack
    // tightly by construction.
    it("every layout has an aspect-ratio image class, no grid span classes", () => {
      for (const layout of EDITORIAL_GALLERY_LAYOUTS) {
        expect(layout.imageClass).toMatch(/aspect-/);
        expect(layout.itemClass).not.toMatch(/col-span|row-span/);
        expect(layout.imageClass).not.toMatch(/col-span|row-span/);
      }
    });

    it("large layouts use a taller-than-square aspect ratio", () => {
      for (const layout of EDITORIAL_GALLERY_LAYOUTS) {
        if (layout.category === "large") {
          expect(layout.imageClass).toBe("aspect-[4/5]");
        }
      }
    });

    it("wide layouts use a landscape aspect ratio", () => {
      for (const layout of EDITORIAL_GALLERY_LAYOUTS) {
        if (layout.category === "wide") {
          expect(layout.imageClass).toBe("aspect-[16/9]");
        }
      }
    });

    it("tall layouts use the most vertical aspect ratio", () => {
      for (const layout of EDITORIAL_GALLERY_LAYOUTS) {
        if (layout.category === "tall") {
          expect(layout.imageClass).toBe("aspect-[2/3]");
        }
      }
    });

    it("small layouts are square", () => {
      for (const layout of EDITORIAL_GALLERY_LAYOUTS) {
        if (layout.category === "small") {
          expect(layout.imageClass).toBe("aspect-square");
        }
      }
    });
  });

  describe("getGalleryItemLayout", () => {
    it("returns a GalleryItemLayout with required fields", () => {
      const layout = getGalleryItemLayout(0);
      expect(layout).toHaveProperty("itemClass");
      expect(layout).toHaveProperty("imageClass");
      expect(layout).toHaveProperty("category");
    });

    it("cycles through layouts deterministically", () => {
      const layoutA = getGalleryItemLayout(0);
      const layoutB = getGalleryItemLayout(0);
      expect(layoutA).toEqual(layoutB);
    });

    it("handles negative indices gracefully", () => {
      expect(() => getGalleryItemLayout(-1)).not.toThrow();
      expect(getGalleryItemLayout(-1)).toEqual(
        EDITORIAL_GALLERY_LAYOUTS[EDITORIAL_GALLERY_LAYOUTS.length - 1]
      );
    });

    it("wraps around after the pattern length when total equals pattern length", () => {
      const length = EDITORIAL_GALLERY_LAYOUTS.length;
      expect(getGalleryItemLayout(length)).toEqual(getGalleryItemLayout(0));
      expect(getGalleryItemLayout(length + 1)).toEqual(getGalleryItemLayout(1));
    });

    it("handles very large indices without crashing", () => {
      expect(() => getGalleryItemLayout(9999)).not.toThrow();
    });

    // Regression coverage for the real bug found 2026-07-04: a short gallery
    // (8 photos) was getting a raw truncated slice of the 12-item pattern,
    // landing on 2 of the 2 "wide" beats by chance; a long gallery (15
    // photos) wrapped and abruptly restarted the pattern from index 0.
    it("maps proportionally across the full pattern for a short gallery (does not just truncate)", () => {
      const total = 8;
      const seenCategories = new Set(
        Array.from({ length: total }, (_, i) => getGalleryItemLayout(i, total).category)
      );
      // A representative proportional sample of 8 items across a balanced
      // 12-item pattern should still surface at least 3 of the 4 categories,
      // not collapse onto 1-2 from a truncated prefix.
      expect(seenCategories.size).toBeGreaterThanOrEqual(3);
    });

    it("does not abruptly reset to index 0's category right after the pattern length for a long gallery", () => {
      const total = 15;
      const patternLength = EDITORIAL_GALLERY_LAYOUTS.length;
      const lastOfFirstCycle = getGalleryItemLayout(patternLength - 1, total);
      const firstOfSecondCycle = getGalleryItemLayout(patternLength, total);
      // With proportional mapping these should not necessarily be identical
      // to the raw index-0 layout (that would indicate a hard reset).
      expect(firstOfSecondCycle).not.toBe(getGalleryItemLayout(0, total));
      expect(lastOfFirstCycle).toBeDefined();
    });

    it("applies a per-trip offset so two trips don't share an identical opening rhythm", () => {
      const offsetA = getTripPatternOffset("japan-2024");
      const offsetB = getTripPatternOffset("ecuador-2024");
      const layoutsA = Array.from({ length: 4 }, (_, i) => getGalleryItemLayout(i, 12, offsetA).category);
      const layoutsB = Array.from({ length: 4 }, (_, i) => getGalleryItemLayout(i, 12, offsetB).category);
      // Not a strict guarantee for every possible pair (hash collisions are
      // possible), but this specific pair should differ given the offsets.
      if (offsetA !== offsetB) {
        expect(layoutsA).not.toEqual(layoutsB);
      }
    });
  });

  describe("getTripPatternOffset", () => {
    it("is deterministic for the same trip id", () => {
      expect(getTripPatternOffset("japan-2024")).toBe(getTripPatternOffset("japan-2024"));
    });

    it("returns a value within the pattern length range", () => {
      const offset = getTripPatternOffset("costarica-2023");
      expect(offset).toBeGreaterThanOrEqual(0);
      expect(offset).toBeLessThan(EDITORIAL_GALLERY_LAYOUTS.length);
    });
  });

  describe("countLayoutsByCategory", () => {
    it("returns counts that sum to the total number of layouts", () => {
      const counts = countLayoutsByCategory();
      const total = Object.values(counts).reduce((sum: number, n: number) => sum + n, 0);
      expect(total).toBe(EDITORIAL_GALLERY_LAYOUTS.length);
    });

    it("returns an object with keys for each category", () => {
      const counts = countLayoutsByCategory();
      expect(counts).toHaveProperty("large");
      expect(counts).toHaveProperty("wide");
      expect(counts).toHaveProperty("tall");
      expect(counts).toHaveProperty("small");
    });
  });
});
