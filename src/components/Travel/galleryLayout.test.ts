import { describe, it, expect } from "vitest";
import {
  getTileAspect,
  justifyRows,
  MIN_TILE_ASPECT,
  MAX_TILE_ASPECT,
  FALLBACK_TILE_ASPECT,
} from "./galleryLayout";
import trips from "../../data/structured/trips.json";

describe("getTileAspect", () => {
  it("uses the photo's own ratio when it's inside the clamp", () => {
    expect(getTileAspect({ width: 1920, height: 1080 })).toBeCloseTo(16 / 9);
    expect(getTileAspect({ width: 1536, height: 2048 })).toBeCloseTo(3 / 4);
  });

  it("clamps panoramas and very tall shots", () => {
    expect(getTileAspect({ width: 4000, height: 900 })).toBe(MAX_TILE_ASPECT);
    expect(getTileAspect({ width: 500, height: 2000 })).toBe(MIN_TILE_ASPECT);
  });

  it("falls back when dimensions are missing", () => {
    expect(getTileAspect({})).toBe(FALLBACK_TILE_ASPECT);
    expect(getTileAspect({ width: 0, height: 100 })).toBe(FALLBACK_TILE_ASPECT);
  });

  it("every trip photo has dimensions, so no tile relies on the fallback", () => {
    for (const trip of trips) {
      for (const photo of trip.photos) {
        expect(photo.width, photo.url).toBeGreaterThan(0);
        expect(photo.height, photo.url).toBeGreaterThan(0);
      }
    }
  });
});


describe("justifyRows", () => {
  const aspects = [0.75, 1.78, 0.75, 1.33, 0.67, 1.78, 0.75, 1.33, 1.78, 0.75, 1.5];
  const width = 960;
  const gap = 16;
  const rowWidth = (indices: number[], height: number) =>
    indices.reduce((sum, i) => sum + aspects[i] * height, 0) + gap * (indices.length - 1);

  it("places every photo exactly once, in order", () => {
    const rows = justifyRows(aspects, width, 260, gap);
    expect(rows.flatMap((r) => r.indices)).toEqual(aspects.map((_, i) => i));
  });

  it("makes every full row exactly fill the width", () => {
    for (const row of justifyRows(aspects, width, 260, gap).filter((r) => !r.partial)) {
      expect(rowWidth(row.indices, row.height)).toBeCloseTo(width);
    }
  });

  it("folds a lone trailing photo into the row above", () => {
    const rows = justifyRows([1.78, 1.78, 1.78, 0.75], width, 260, gap);
    expect(rows.some((r) => r.partial && r.indices.length === 1)).toBe(false);
  });

  it("returns no rows before the container is measured", () => {
    expect(justifyRows(aspects, 0, 260, gap)).toEqual([]);
  });
});
