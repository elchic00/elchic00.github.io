export type LayoutCategory = "large" | "wide" | "tall" | "small";

export interface GalleryItemLayout {
  itemClass: string;
  imageClass: string;
  category: LayoutCategory;
}

/**
 * Editorial gallery layout pattern — 12 items for varied visual rhythm.
 *
 * Layout mechanism: CSS multi-column masonry (`columns-*` on the container,
 * `break-inside-avoid` per item), NOT CSS Grid. Grid with mixed row/col
 * spans in row-major auto-flow can leave real, unfillable gaps when spans
 * don't tile perfectly (confirmed: `grid-flow-dense` alone doesn't fix this
 * — dense packing can only reorder items into existing gaps, it can't
 * manufacture content to fill a gap shape nothing else fits). Masonry
 * columns flow top-to-bottom per column and pack tightly by construction,
 * so variety here comes from aspect ratio per item, not grid span.
 *
 * Categories (aspect ratio, all columns equal width):
 *   large — 4:5, prominent vertical presence
 *   wide  — 16:9, landscape breather
 *   tall  — 2:3, most vertical emphasis
 *   small — 1:1, compact
 *
 * Distribution: 3 large, 2 wide, 3 tall, 4 small (balanced, no category > 50%)
 * — same distribution as the original grid-based design, carried over.
 */
export const EDITORIAL_GALLERY_LAYOUTS: readonly GalleryItemLayout[] = [
  // 0: large — hero shot to open the gallery
  { itemClass: "", imageClass: "aspect-[4/5]", category: "large" },
  // 1: small
  { itemClass: "", imageClass: "aspect-square", category: "small" },
  // 2: tall
  { itemClass: "", imageClass: "aspect-[2/3]", category: "tall" },
  // 3: wide — landscape breather
  { itemClass: "", imageClass: "aspect-[16/9]", category: "wide" },
  // 4: tall
  { itemClass: "", imageClass: "aspect-[2/3]", category: "tall" },
  // 5: small
  { itemClass: "", imageClass: "aspect-square", category: "small" },
  // 6: wide — landscape breather
  { itemClass: "", imageClass: "aspect-[16/9]", category: "wide" },
  // 7: large
  { itemClass: "", imageClass: "aspect-[4/5]", category: "large" },
  // 8: small
  { itemClass: "", imageClass: "aspect-square", category: "small" },
  // 9: tall
  { itemClass: "", imageClass: "aspect-[2/3]", category: "tall" },
  // 10: large
  { itemClass: "", imageClass: "aspect-[4/5]", category: "large" },
  // 11: small
  { itemClass: "", imageClass: "aspect-square", category: "small" },
];

export function countLayoutsByCategory(): Record<LayoutCategory, number> {
  const counts: Record<LayoutCategory, number> = { large: 0, wide: 0, tall: 0, small: 0 };
  for (const layout of EDITORIAL_GALLERY_LAYOUTS) {
    counts[layout.category] += 1;
  }
  return counts;
}

/**
 * Deterministic per-trip starting offset into the pattern, derived from the
 * trip id. Without this, every trip's gallery opens with the exact same
 * rhythm (large, small, tall, wide, ...) — identical across all six trips
 * reads as a stamped-out template, not a composed page. A stable per-trip
 * offset means each gallery starts at a different point in the same
 * balanced cycle, so the rhythm varies trip to trip while staying
 * reproducible (same trip always gets the same offset, no randomness at
 * render time).
 */
// Trips whose opening photo is a deliberate hero shot get offset 0, so the
// pattern's own "large — hero shot to open the gallery" slot lands on it
// instead of wherever the hash happens to fall.
const OFFSET_OVERRIDES: Record<string, number> = {
  "japan-2024": 0,
};

export function getTripPatternOffset(tripId: string): number {
  if (tripId in OFFSET_OVERRIDES) return OFFSET_OVERRIDES[tripId];

  let hash = 0;
  for (let i = 0; i < tripId.length; i++) {
    hash = (hash * 31 + tripId.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % EDITORIAL_GALLERY_LAYOUTS.length;
}

/**
 * Get the layout configuration for a gallery item by its index.
 * Deterministic, cycle-based — no metadata needed in trips.json.
 *
 * `total` (the gallery's actual photo count) is required to map the index
 * proportionally into the 12-item pattern rather than slicing/wrapping it
 * raw. Without this, a short gallery (e.g. 8 photos) just gets a truncated
 * prefix of the pattern, and a long gallery (e.g. 15 photos) wraps and
 * abruptly restarts the pattern from index 0. Proportional remapping
 * (`floor(index * patternLength / total)`) keeps every gallery length
 * sampling the full, balanced rhythm instead of an arbitrary slice.
 *
 * `offset` (see getTripPatternOffset) shifts the starting point per trip
 * so the rhythm doesn't repeat identically across every gallery.
 */
export const getGalleryItemLayout = (
  index: number,
  total: number = EDITORIAL_GALLERY_LAYOUTS.length,
  offset: number = 0,
): GalleryItemLayout => {
  const patternLength = EDITORIAL_GALLERY_LAYOUTS.length;
  const mappedIndex = total > 0 ? Math.floor((index * patternLength) / total) : index;
  const safeIndex = ((mappedIndex + offset) % patternLength + patternLength) % patternLength;

  return EDITORIAL_GALLERY_LAYOUTS[safeIndex];
};
