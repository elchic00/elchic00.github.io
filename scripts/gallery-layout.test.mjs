import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  getTileAspect,
  justifyRows,
  MIN_TILE_ASPECT,
  MAX_TILE_ASPECT,
  FALLBACK_TILE_ASPECT,
} from "../src/components/Travel/galleryLayout.ts";

assert.ok(Math.abs(getTileAspect({ width: 1920, height: 1080 }) - 16 / 9) < 1e-9);
assert.equal(getTileAspect({ width: 4000, height: 900 }), MAX_TILE_ASPECT);
assert.equal(getTileAspect({ width: 500, height: 2000 }), MIN_TILE_ASPECT);
assert.equal(getTileAspect({}), FALLBACK_TILE_ASPECT);

// Justified rows: every photo once and in order, full rows fill the width,
// and a lone trailing photo is folded into the row above.
const aspects = [0.75, 1.78, 0.75, 1.33, 0.67, 1.78, 0.75, 1.33, 1.78, 0.75, 1.5];
const rows = justifyRows(aspects, 960, 260, 16);
assert.deepEqual(rows.flatMap((r) => r.indices), aspects.map((_, i) => i));
for (const row of rows.filter((r) => !r.partial)) {
  const w = row.indices.reduce((s, i) => s + aspects[i] * row.height, 0) + 16 * (row.indices.length - 1);
  assert.ok(Math.abs(w - 960) < 1e-6, "full rows fill the width");
}
assert.ok(!justifyRows([1.78, 1.78, 1.78, 0.75], 960, 260, 16).some((r) => r.partial && r.indices.length === 1));

// Every photo needs real dimensions, or its tile falls back to a guessed shape.
const trips = JSON.parse(
  readFileSync(new URL("../src/data/structured/trips.json", import.meta.url), "utf8")
);
for (const trip of trips) {
  for (const photo of trip.photos) {
    assert.ok(photo.width > 0 && photo.height > 0, `missing dimensions: ${photo.url}`);
  }
}

console.log("gallery layout helper checks passed");
