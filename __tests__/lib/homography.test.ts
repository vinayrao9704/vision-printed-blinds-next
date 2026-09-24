import { computeHomography, invertMatrix3x3, applyHomography } from '@/lib/homography';
import type { Point } from '@/lib/homography';

describe('computeHomography + applyHomography', () => {
  it('maps a unit square onto itself as the identity', () => {
    const unit: Point[] = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
    const H = computeHomography(unit, unit);
    unit.forEach((p) => {
      const out = applyHomography(H, p.x, p.y);
      expect(out.x).toBeCloseTo(p.x, 5);
      expect(out.y).toBeCloseTo(p.y, 5);
    });
  });

  it('maps a rectangle to a scaled rectangle correctly (pure scale, no perspective)', () => {
    const src: Point[] = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }];
    const dst: Point[] = [{ x: 0, y: 0 }, { x: 20, y: 0 }, { x: 20, y: 20 }, { x: 0, y: 20 }];
    const H = computeHomography(src, dst);
    const mid = applyHomography(H, 5, 5);
    expect(mid.x).toBeCloseTo(10, 3);
    expect(mid.y).toBeCloseTo(10, 3);
  });

  it('maps all 4 source corners exactly onto their destination corners for a true perspective quad', () => {
    const src: Point[] = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }];
    // an irregular, non-rectangular quad — genuine perspective, not just affine
    const dst: Point[] = [{ x: 10, y: 5 }, { x: 210, y: 20 }, { x: 190, y: 220 }, { x: 5, y: 190 }];
    const H = computeHomography(src, dst);
    src.forEach((p, i) => {
      const out = applyHomography(H, p.x, p.y);
      expect(out.x).toBeCloseTo(dst[i].x, 2);
      expect(out.y).toBeCloseTo(dst[i].y, 2);
    });
  });
});

describe('invertMatrix3x3', () => {
  it('inverting the identity homography yields the identity', () => {
    const identity = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    const inv = invertMatrix3x3(identity);
    inv.forEach((v, i) => expect(v).toBeCloseTo(identity[i], 5));
  });

  it('H * inverse(H) maps a point back to itself (round-trip)', () => {
    const src: Point[] = [{ x: 0, y: 0 }, { x: 50, y: 0 }, { x: 50, y: 80 }, { x: 0, y: 80 }];
    const dst: Point[] = [{ x: 3, y: 4 }, { x: 96, y: 12 }, { x: 88, y: 150 }, { x: 8, y: 140 }];
    const H = computeHomography(src, dst);
    const Hinv = invertMatrix3x3(H);
    const forward = applyHomography(H, 25, 40);
    const back = applyHomography(Hinv, forward.x, forward.y);
    expect(back.x).toBeCloseTo(25, 1);
    expect(back.y).toBeCloseTo(40, 1);
  });

  it('does not throw on a near-singular (degenerate) matrix', () => {
    const degenerate = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    expect(() => invertMatrix3x3(degenerate)).not.toThrow();
  });
});
