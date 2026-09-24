import type { Point } from './homography';

export interface WindowCandidate {
  /** Always exactly 4 points, ordered TL, TR, BR, BL, in full-resolution image pixels. */
  quad: [Point, Point, Point, Point];
  score: number;
}

/*
 * This used to load OpenCV.js (a ~10MB WASM build) from a CDN and run a
 * Canny-edge + contour pipeline. In practice that hung indefinitely in real
 * use: the JS loader downloaded fine, but WASM compilation/instantiation
 * never resolved in the browser and blocked the main thread completely (no
 * spinner, no fallback button, no state update could run — confirmed by
 * reproducing it with a Playwright trace: even a trivial page.evaluate()
 * call stopped responding after upload). A broken "smarter" detector is
 * strictly worse than a simpler one that reliably finishes, so this is a
 * dependency-free, pure-JS/Canvas algorithm instead — no network request,
 * no WASM, bounded loops over a small downscaled image, guaranteed to
 * complete in well under a second.
 *
 * Trade-off: without real contour analysis this finds axis-aligned bright
 * rectangles rather than arbitrary rotated quadrilaterals. For an angled
 * photo the initial auto-detected box may not perfectly match the window's
 * perspective — that's exactly what the existing manual "Adjust Window"
 * corner-drag editor is for, and it's unconditionally available either way.
 */

const ANALYSIS_DIM = 100; // analysis canvas long-edge size — small enough to stay fast, large enough to be accurate
const MAX_RELATIVE_AREA = 0.6;
const MAX_CANDIDATES = 4;
const MIN_SCORE = 1.12; // candidate must be at least this much brighter than the room average to count as a window
const IOU_DEDUPE_THRESHOLD = 0.25;
const POSITION_STEP = 4; // sliding-window position stride, in analysis-canvas pixels
// A fixed, small set of candidate box sizes (as a fraction of the analysis
// canvas) tried at every scanned position, instead of an unbounded nested
// loop over every possible width x height. This keeps the whole scan at
// position_count x SIZE_FRACTIONS^2 evaluations — a few tens of thousands,
// each O(1) via the integral image below — so it's bounded in the tens of
// milliseconds regardless of photo size, never a multi-second block.
const SIZE_FRACTIONS = [0.22, 0.32, 0.42, 0.52, 0.62, 0.72];

export function polygonArea(pts: Point[]): number {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % pts.length];
    a += p1.x * p2.y - p2.x * p1.y;
  }
  return Math.abs(a) / 2;
}

export function pointInPolygon(pt: Point, poly: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const intersect = yi > pt.y !== yj > pt.y && pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function orderQuadPoints(pts: Point[]): [Point, Point, Point, Point] {
  const cx = pts.reduce((a, p) => a + p.x, 0) / 4;
  const cy = pts.reduce((a, p) => a + p.y, 0) / 4;
  const byAngle = [...pts].sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx));
  let startIdx = 0;
  let best = Infinity;
  byAngle.forEach((p, i) => {
    const s = p.x + p.y;
    if (s < best) {
      best = s;
      startIdx = i;
    }
  });
  const rotated = byAngle.slice(startIdx).concat(byAngle.slice(0, startIdx));
  return rotated as [Point, Point, Point, Point];
}

function quadBBox(q: Point[]) {
  const xs = q.map((p) => p.x);
  const ys = q.map((p) => p.y);
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

export function bboxIoU(a: Point[], b: Point[]): number {
  const ba = quadBBox(a);
  const bb = quadBBox(b);
  const ix = Math.max(0, Math.min(ba.maxX, bb.maxX) - Math.max(ba.minX, bb.minX));
  const iy = Math.max(0, Math.min(ba.maxY, bb.maxY) - Math.max(ba.minY, bb.minY));
  const inter = ix * iy;
  const areaA = (ba.maxX - ba.minX) * (ba.maxY - ba.minY);
  const areaB = (bb.maxX - bb.minX) * (bb.maxY - bb.minY);
  const union = areaA + areaB - inter;
  return union > 0 ? inter / union : 0;
}

function rectToQuad(x0: number, y0: number, x1: number, y1: number): Point[] {
  return [
    { x: x0, y: y0 },
    { x: x1, y: y0 },
    { x: x1, y: y1 },
    { x: x0, y: y1 },
  ];
}

/**
 * Finds candidate window rectangles by scoring every axis-aligned rectangle
 * (on a coarse grid) by how much brighter its interior is than a margin
 * just outside it — windows are reliably the brightest thing in a room
 * photo, and this contrast-against-surroundings check (rather than raw
 * brightness alone) avoids just picking an overexposed wall patch. An
 * integral image makes each candidate's average O(1), so evaluating
 * thousands of candidate rectangles stays well under 100ms even on
 * low-end hardware — there is no path in this function that can block for
 * more than one synchronous pass over a ~140x140 array.
 */
export async function detectWindows(img: HTMLImageElement): Promise<WindowCandidate[]> {
  const longEdge = Math.max(img.naturalWidth, img.naturalHeight) || 1;
  const scale = Math.min(1, ANALYSIS_DIM / longEdge);
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;

  // Brightness grid + integral image (1-indexed, padded) for O(1) area sums.
  const integral = new Float64Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) {
    let rowSum = 0;
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      const brightness = data[o] * 0.299 + data[o + 1] * 0.587 + data[o + 2] * 0.114;
      rowSum += brightness;
      integral[(y + 1) * (w + 1) + (x + 1)] = integral[y * (w + 1) + (x + 1)] + rowSum;
    }
  }
  const areaSum = (x0: number, y0: number, x1: number, y1: number): number =>
    integral[y1 * (w + 1) + x1] - integral[y0 * (w + 1) + x1] - integral[y1 * (w + 1) + x0] + integral[y0 * (w + 1) + x0];
  const areaAvg = (x0: number, y0: number, x1: number, y1: number): number => {
    const n = (x1 - x0) * (y1 - y0);
    return n > 0 ? areaSum(x0, y0, x1, y1) / n : 0;
  };

  const totalAvg = areaAvg(0, 0, w, h) || 1;
  const imageArea = w * h;
  const margin = Math.max(2, Math.round(Math.min(w, h) * 0.04));
  const candidateSizes = SIZE_FRACTIONS.map((f) => ({
    ww: Math.max(4, Math.round(w * f)),
    hh: Math.max(4, Math.round(h * f)),
  }));

  type Candidate = { rect: [number, number, number, number]; score: number };
  const found: Candidate[] = [];

  // Greedy: find the best-scoring rectangle, record it as "taken" so the
  // next pass skips anything overlapping it, repeat. Gives real multi-window
  // support without ever mutating the pixel data.
  const taken: [number, number, number, number][] = [];
  const overlapsTaken = (x0: number, y0: number, x1: number, y1: number) =>
    taken.some((t) => x0 < t[2] && x1 > t[0] && y0 < t[3] && y1 > t[1]);

  for (let pass = 0; pass < MAX_CANDIDATES; pass++) {
    let bestScore = 0;
    let bestRect: [number, number, number, number] | null = null;

    for (let y0 = 0; y0 < h; y0 += POSITION_STEP) {
      for (let x0 = 0; x0 < w; x0 += POSITION_STEP) {
        for (const { ww, hh } of candidateSizes) {
          const x1 = x0 + ww;
          const y1 = y0 + hh;
          if (x1 > w || y1 > h) continue;
          const relArea = (ww * hh) / imageArea;
          if (relArea > MAX_RELATIVE_AREA) continue;
          if (overlapsTaken(x0, y0, x1, y1)) continue;

          const inner = areaAvg(x0, y0, x1, y1);

          // Compare against a thin ring just outside the rectangle.
          const ox0 = Math.max(0, x0 - margin);
          const oy0 = Math.max(0, y0 - margin);
          const ox1 = Math.min(w, x1 + margin);
          const oy1 = Math.min(h, y1 + margin);
          const outerSum = areaSum(ox0, oy0, ox1, oy1) - areaSum(x0, y0, x1, y1);
          const outerN = (ox1 - ox0) * (oy1 - oy0) - ww * hh;
          const outerAvg = outerN > 0 ? outerSum / outerN : totalAvg;

          const contrast = (inner + 8) / (outerAvg + 8);
          // Favor larger, more contrasty regions without letting huge low-contrast areas win.
          const score = contrast * (0.6 + 0.4 * Math.sqrt(relArea / MAX_RELATIVE_AREA));

          if (score > bestScore) {
            bestScore = score;
            bestRect = [x0, y0, x1, y1];
          }
        }
      }
    }

    if (!bestRect || bestScore < MIN_SCORE) break;
    found.push({ rect: bestRect, score: bestScore });
    taken.push(bestRect);
  }

  const candidates: WindowCandidate[] = found.map(({ rect, score }) => {
    const [x0, y0, x1, y1] = rect;
    const quad = orderQuadPoints(rectToQuad(x0 / scale, y0 / scale, x1 / scale, y1 / scale));
    return { quad, score };
  });

  candidates.sort((a, b) => b.score - a.score);
  const final: WindowCandidate[] = [];
  for (const c of candidates) {
    if (final.every((f) => bboxIoU(f.quad, c.quad) < IOU_DEDUPE_THRESHOLD)) final.push(c);
  }
  return final.slice(0, MAX_CANDIDATES);
}
