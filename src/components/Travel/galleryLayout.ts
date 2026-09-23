import type { Photo } from "../../types";

/**
 * Gallery tiles use each photo's own aspect ratio (from width/height in
 * trips.json), so nothing gets cropped into a shape it wasn't shot in.
 * PhotoGallery lays tiles out in justified rows (see justifyRows), so
 * mixed portrait and landscape shots share rows at equal height.
 *
 * Ratios are clamped so a panorama doesn't take a whole row as a thin strip
 * and a very tall shot doesn't dwarf its row. Photos past the clamp crop a little.
 */
export const MIN_TILE_ASPECT = 2 / 3;
export const MAX_TILE_ASPECT = 2.5;
// Used only if a photo is missing dimensions: a neutral portrait-ish tile.
export const FALLBACK_TILE_ASPECT = 4 / 5;

export const getTileAspect = (photo: Pick<Photo, "width" | "height">): number => {
  const { width, height } = photo;
  if (!width || !height) return FALLBACK_TILE_ASPECT;
  return Math.min(MAX_TILE_ASPECT, Math.max(MIN_TILE_ASPECT, width / height));
};


export interface JustifiedRow {
  indices: number[];
  height: number;
  // The final row keeps its natural size instead of stretching to full width.
  partial: boolean;
}

/**
 * Packs photos into rows that exactly fill `width`, each row as close to
 * `targetHeight` as the photos allow. A short final row is folded into the
 * row above it, so a gallery never ends on one stranded photo; one that can
 * stretch to the edge without getting much taller does.
 */
export const justifyRows = (
  aspects: number[],
  width: number,
  targetHeight: number,
  gap: number,
): JustifiedRow[] => {
  if (width <= 0) return [];
  const heightFor = (indices: number[]) =>
    (width - gap * (indices.length - 1)) / indices.reduce((sum, i) => sum + aspects[i], 0);

  const rows: number[][] = [];
  let current: number[] = [];
  aspects.forEach((_, i) => {
    current.push(i);
    const height = heightFor(current);
    if (height > targetHeight) return;
    // Row is full: close it with or without this photo, whichever lands nearer the target.
    const withoutLast = current.slice(0, -1);
    if (withoutLast.length && Math.abs(heightFor(withoutLast) - targetHeight) < targetHeight - height) {
      rows.push(withoutLast);
      current = [i];
    } else {
      rows.push(current);
      current = [];
    }
  });

  const naturalWidth = (indices: number[]) =>
    indices.reduce((sum, i) => sum + aspects[i], 0) * targetHeight + gap * (indices.length - 1);

  // Short final row: first try pulling photos down from the row above until
  // both rows are full, as long as the row above doesn't get too tall.
  if (current.length && rows.length) {
    const prev = [...rows[rows.length - 1]];
    const last = [...current];
    while (prev.length > 1 && naturalWidth(last) < width * 0.8) {
      last.unshift(prev.pop()!);
    }
    if (naturalWidth(last) >= width * 0.8 && heightFor(prev) <= targetHeight * 1.5) {
      rows[rows.length - 1] = prev;
      current = last;
    }
  }

  let partial = false;
  if (current.length) {
    const lastWidth = naturalWidth(current);
    const merged = rows.length ? [...rows[rows.length - 1], ...current] : [];
    // Too short to stand alone, as long as folding it in doesn't squash the row above.
    if (merged.length && lastWidth < width * 0.6 && heightFor(merged) >= targetHeight * 0.6) {
      rows[rows.length - 1] = merged;
    } else {
      rows.push(current);
      // Stretch to the edge unless that would make the row much taller than the rest.
      partial = heightFor(current) > targetHeight * 1.5;
    }
  }

  return rows.map((indices, r) => {
    const isPartial = partial && r === rows.length - 1;
    return {
      indices,
      height: isPartial ? Math.min(targetHeight, heightFor(indices)) : heightFor(indices),
      partial: isPartial,
    };
  });
};
