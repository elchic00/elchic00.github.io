import assert from "node:assert/strict";
import {
  EDITORIAL_GALLERY_LAYOUTS,
  countLayoutsByCategory,
  getGalleryItemLayout,
  getTripPatternOffset,
} from "../src/components/Travel/galleryLayout.ts";

assert.ok(EDITORIAL_GALLERY_LAYOUTS.length > 6);

const categoryCounts = countLayoutsByCategory();
assert.deepEqual(Object.keys(categoryCounts).sort(), ["large", "small", "tall", "wide"]);
assert.equal(
  Object.values(categoryCounts).reduce((sum, count) => sum + count, 0),
  EDITORIAL_GALLERY_LAYOUTS.length
);

for (const layout of EDITORIAL_GALLERY_LAYOUTS) {
  assert.match(layout.imageClass, /aspect-/);
  assert.doesNotMatch(layout.itemClass, /col-span|row-span/);
  assert.doesNotMatch(layout.imageClass, /col-span|row-span/);
}

assert.equal(getGalleryItemLayout(-1), EDITORIAL_GALLERY_LAYOUTS[EDITORIAL_GALLERY_LAYOUTS.length - 1]);

const patternLength = EDITORIAL_GALLERY_LAYOUTS.length;
assert.equal(getGalleryItemLayout(patternLength), getGalleryItemLayout(0));
assert.equal(getGalleryItemLayout(patternLength + 1), getGalleryItemLayout(1));

const rhythm = new Set(
  Array.from({ length: 8 }, (_, index) => getGalleryItemLayout(index, 8).category)
);
assert.ok(rhythm.size >= 3, "short galleries should sample a varied editorial rhythm");

const offsetA = getTripPatternOffset("japan-2024");
const offsetB = getTripPatternOffset("ecuador-2024");
assert.ok(offsetA >= 0 && offsetA < patternLength);
assert.ok(offsetB >= 0 && offsetB < patternLength);
if (offsetA !== offsetB) {
  const layoutsA = Array.from({ length: 4 }, (_, index) => getGalleryItemLayout(index, 12, offsetA).category);
  const layoutsB = Array.from({ length: 4 }, (_, index) => getGalleryItemLayout(index, 12, offsetB).category);
  assert.notDeepEqual(layoutsA, layoutsB);
}

const fallback = getGalleryItemLayout(47);
assert.equal(typeof fallback.itemClass, "string");
assert.equal(typeof fallback.imageClass, "string");
assert.ok(["large", "wide", "tall", "small"].includes(fallback.category));

console.log("gallery layout helper checks passed");
