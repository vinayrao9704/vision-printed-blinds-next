import { polygonArea, pointInPolygon, orderQuadPoints, bboxIoU } from '@/lib/windowDetection';

describe('polygonArea', () => {
  it('computes the area of a simple square', () => {
    const square = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }];
    expect(polygonArea(square)).toBeCloseTo(100, 5);
  });

  it('returns 0 for a degenerate (zero-width) polygon', () => {
    const line = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 0 }];
    expect(polygonArea(line)).toBeCloseTo(0, 5);
  });

  it('is orientation-independent (same area clockwise or counter-clockwise)', () => {
    const cw = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }];
    const ccw = [...cw].reverse();
    expect(polygonArea(cw)).toBeCloseTo(polygonArea(ccw), 5);
  });
});

describe('pointInPolygon', () => {
  const square = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }];

  it('returns true for a point clearly inside', () => {
    expect(pointInPolygon({ x: 5, y: 5 }, square)).toBe(true);
  });

  it('returns false for a point clearly outside', () => {
    expect(pointInPolygon({ x: 50, y: 50 }, square)).toBe(false);
    expect(pointInPolygon({ x: -5, y: 5 }, square)).toBe(false);
  });
});

describe('orderQuadPoints', () => {
  it('always returns exactly 4 points', () => {
    const shuffled = [{ x: 10, y: 0 }, { x: 0, y: 10 }, { x: 0, y: 0 }, { x: 10, y: 10 }];
    expect(orderQuadPoints(shuffled)).toHaveLength(4);
  });

  it('orders an arbitrarily-shuffled square starting from top-left', () => {
    // TL=(0,0) TR=(10,0) BR=(10,10) BL=(0,10), shuffled input order
    const shuffled = [{ x: 10, y: 10 }, { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 10 }];
    const ordered = orderQuadPoints(shuffled);
    // first point should be the one with the smallest x+y (top-left)
    expect(ordered[0]).toEqual({ x: 0, y: 0 });
  });
});

describe('bboxIoU', () => {
  it('returns 1 for two identical quads', () => {
    const q = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }];
    expect(bboxIoU(q, q)).toBeCloseTo(1, 5);
  });

  it('returns 0 for two quads that do not overlap at all', () => {
    const a = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }];
    const b = [{ x: 100, y: 100 }, { x: 110, y: 100 }, { x: 110, y: 110 }, { x: 100, y: 110 }];
    expect(bboxIoU(a, b)).toBe(0);
  });

  it('returns a value between 0 and 1 for partially-overlapping quads', () => {
    const a = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }];
    const b = [{ x: 5, y: 5 }, { x: 15, y: 5 }, { x: 15, y: 15 }, { x: 5, y: 15 }];
    const iou = bboxIoU(a, b);
    expect(iou).toBeGreaterThan(0);
    expect(iou).toBeLessThan(1);
  });
});
