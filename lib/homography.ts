export interface Point {
  x: number;
  y: number;
}

/**
 * Solves an n x n linear system Ax = b via Gaussian elimination with
 * partial pivoting. Used to solve the 8-equation DLT system for a
 * homography from exactly 4 point correspondences.
 */
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
    }
    [M[col], M[pivot]] = [M[pivot], M[col]];
    const pv = M[col][col];
    if (Math.abs(pv) < 1e-12) continue;
    for (let c = col; c <= n; c++) M[col][c] /= pv;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = M[r][col];
      if (factor === 0) continue;
      for (let c = col; c <= n; c++) M[r][c] -= factor * M[col][c];
    }
  }
  return M.map((row) => row[n]);
}

/**
 * Computes the 3x3 homography matrix H (row-major, h[8]=1) such that
 * for each i, dst[i] ~ H * src[i] in homogeneous coordinates.
 * Requires exactly 4 point correspondences (the exact/determined case).
 */
export function computeHomography(src: Point[], dst: Point[]): number[] {
  const A: number[][] = [];
  const B: number[] = [];
  for (let i = 0; i < 4; i++) {
    const { x: sx, y: sy } = src[i];
    const { x: dx, y: dy } = dst[i];
    A.push([sx, sy, 1, 0, 0, 0, -sx * dx, -sy * dx]);
    B.push(dx);
    A.push([0, 0, 0, sx, sy, 1, -sx * dy, -sy * dy]);
    B.push(dy);
  }
  const h = solveLinearSystem(A, B);
  return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1];
}

/** Inverts a 3x3 matrix given in row-major order. */
export function invertMatrix3x3(h: number[]): number[] {
  const m = [
    [h[0], h[1], h[2]],
    [h[3], h[4], h[5]],
    [h[6], h[7], h[8]],
  ];
  const det =
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const invDet = 1 / (det || 1e-12);
  return [
    (m[1][1] * m[2][2] - m[1][2] * m[2][1]) * invDet,
    -(m[0][1] * m[2][2] - m[0][2] * m[2][1]) * invDet,
    (m[0][1] * m[1][2] - m[0][2] * m[1][1]) * invDet,
    -(m[1][0] * m[2][2] - m[1][2] * m[2][0]) * invDet,
    (m[0][0] * m[2][2] - m[0][2] * m[2][0]) * invDet,
    -(m[0][0] * m[1][2] - m[0][2] * m[1][0]) * invDet,
    (m[1][0] * m[2][1] - m[1][1] * m[2][0]) * invDet,
    -(m[0][0] * m[2][1] - m[0][1] * m[2][0]) * invDet,
    (m[0][0] * m[1][1] - m[0][1] * m[1][0]) * invDet,
  ];
}

/** Applies a 3x3 homography to a point, dividing through by the homogeneous w. */
export function applyHomography(h: number[], x: number, y: number): Point {
  const w = h[6] * x + h[7] * y + h[8];
  const safeW = w === 0 ? 1e-12 : w;
  return { x: (h[0] * x + h[1] * y + h[2]) / safeW, y: (h[3] * x + h[4] * y + h[5]) / safeW };
}

/**
 * Warps the full contents of `srcCanvas` (treated as source corners
 * (0,0),(w,0),(w,h),(0,h)) onto the quadrilateral `dstQuad`
 * (TL, TR, BR, BL, in that order) via a perspective-correct inverse
 * mapping with bilinear sampling. Returns an ImageData sized to the
 * quad's bounding box plus the offset at which it should be drawn.
 */
export function warpImageToQuad(
  srcCanvas: HTMLCanvasElement,
  dstQuad: [Point, Point, Point, Point]
): { imageData: ImageData; offsetX: number; offsetY: number } {
  const sw = srcCanvas.width;
  const sh = srcCanvas.height;
  const srcPts: Point[] = [
    { x: 0, y: 0 },
    { x: sw, y: 0 },
    { x: sw, y: sh },
    { x: 0, y: sh },
  ];
  const H = computeHomography(srcPts, dstQuad);
  const Hinv = invertMatrix3x3(H);

  const xs = dstQuad.map((p) => p.x);
  const ys = dstQuad.map((p) => p.y);
  const minX = Math.floor(Math.min(...xs));
  const minY = Math.floor(Math.min(...ys));
  const maxX = Math.ceil(Math.max(...xs));
  const maxY = Math.ceil(Math.max(...ys));
  const w = Math.max(1, maxX - minX);
  const h = Math.max(1, maxY - minY);

  const srcCtx = srcCanvas.getContext('2d')!;
  const srcData = srcCtx.getImageData(0, 0, sw, sh).data;
  const out = new ImageData(w, h);

  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      const dx = px + minX;
      const dy = py + minY;
      const sp = applyHomography(Hinv, dx, dy);
      if (sp.x >= 0 && sp.x < sw - 1 && sp.y >= 0 && sp.y < sh - 1) {
        const x0 = Math.floor(sp.x);
        const y0 = Math.floor(sp.y);
        const fx = sp.x - x0;
        const fy = sp.y - y0;
        const idx = (yy: number, xx: number) => (yy * sw + xx) * 4;
        const i00 = idx(y0, x0);
        const i10 = idx(y0, x0 + 1);
        const i01 = idx(y0 + 1, x0);
        const i11 = idx(y0 + 1, x0 + 1);
        const outIdx = (py * w + px) * 4;
        for (let c = 0; c < 4; c++) {
          const top = srcData[i00 + c] * (1 - fx) + srcData[i10 + c] * fx;
          const bot = srcData[i01 + c] * (1 - fx) + srcData[i11 + c] * fx;
          out.data[outIdx + c] = top * (1 - fy) + bot * fy;
        }
      }
    }
  }
  return { imageData: out, offsetX: minX, offsetY: minY };
}
