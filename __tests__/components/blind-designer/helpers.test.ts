import { validateFile, defaultQuad, corners4, lerp } from '@/components/blind-designer/BlindPreviewTool';
import type { EditPoint } from '@/components/blind-designer/types';

function makeFile(opts: { name?: string; type?: string; size: number }): File {
  const bytes = new Uint8Array(Math.max(0, Math.min(opts.size, 1024))); // cap for test speed
  const file = new File([bytes], opts.name ?? 'test.jpg', { type: opts.type ?? 'image/jpeg' });
  Object.defineProperty(file, 'size', { value: opts.size }); // override to test large-size branch without allocating real bytes
  return file;
}

describe('validateFile', () => {
  it('accepts a normal JPG under the size limit', () => {
    expect(validateFile(makeFile({ type: 'image/jpeg', size: 1024 }))).toBeNull();
  });

  it('accepts PNG and WEBP', () => {
    expect(validateFile(makeFile({ type: 'image/png', size: 1024 }))).toBeNull();
    expect(validateFile(makeFile({ type: 'image/webp', size: 1024 }))).toBeNull();
  });

  it('rejects an empty file', () => {
    expect(validateFile(makeFile({ size: 0 }))).toMatch(/empty/i);
  });

  it('rejects an unsupported format (e.g. GIF)', () => {
    expect(validateFile(makeFile({ type: 'image/gif', size: 1024 }))).toMatch(/unsupported format/i);
  });

  it('rejects a non-image file', () => {
    expect(validateFile(makeFile({ type: 'application/pdf', size: 1024 }))).toMatch(/unsupported format/i);
  });

  it('rejects a file over 20MB', () => {
    const err = validateFile(makeFile({ type: 'image/jpeg', size: 21 * 1024 * 1024 }));
    expect(err).toMatch(/too large/i);
    expect(err).toMatch(/21\.0 MB/);
  });

  it('accepts a file exactly at the 20MB boundary', () => {
    expect(validateFile(makeFile({ type: 'image/jpeg', size: 20 * 1024 * 1024 }))).toBeNull();
  });
});

describe('defaultQuad', () => {
  it('returns exactly 4 corner points', () => {
    const q = defaultQuad(1000, 800);
    expect(q).toHaveLength(4);
    q.forEach((p) => expect(p.corner).toBe(true));
  });

  it('scales proportionally with the given width/height', () => {
    const small = defaultQuad(100, 100);
    const large = defaultQuad(200, 200);
    expect(large[0].x).toBeCloseTo(small[0].x * 2, 5);
    expect(large[0].y).toBeCloseTo(small[0].y * 2, 5);
  });

  it('stays within the image bounds', () => {
    const q = defaultQuad(1000, 800);
    q.forEach((p) => {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(1000);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(800);
    });
  });
});

describe('corners4', () => {
  it('extracts only the 4 corner:true points, ignoring extra mask-only points', () => {
    const points: EditPoint[] = [
      { x: 0, y: 0, corner: true },
      { x: 5, y: 0, corner: false }, // inserted mask point, should be skipped
      { x: 10, y: 0, corner: true },
      { x: 10, y: 10, corner: true },
      { x: 0, y: 10, corner: true },
    ];
    const c = corners4(points);
    expect(c).toHaveLength(4);
    expect(c).toEqual([
      { x: 0, y: 0, corner: true },
      { x: 10, y: 0, corner: true },
      { x: 10, y: 10, corner: true },
      { x: 0, y: 10, corner: true },
    ]);
  });
});

describe('lerp', () => {
  it('returns the start point at t=0', () => {
    expect(lerp({ x: 0, y: 0 }, { x: 10, y: 20 }, 0)).toEqual({ x: 0, y: 0 });
  });

  it('returns the end point at t=1', () => {
    expect(lerp({ x: 0, y: 0 }, { x: 10, y: 20 }, 1)).toEqual({ x: 10, y: 20 });
  });

  it('returns the midpoint at t=0.5', () => {
    expect(lerp({ x: 0, y: 0 }, { x: 10, y: 20 }, 0.5)).toEqual({ x: 5, y: 10 });
  });
});
