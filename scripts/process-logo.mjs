import sharp from 'sharp';
import path from 'path';

const SRC = path.resolve('logo-source.jpg');
const OUT = path.resolve(process.argv[2] || 'public/logo.png');

const NEAR_BLACK = 9;  // flood-fill connectivity cutoff (max channel value) — conservative:
                        // this logo's letters intentionally fade toward black at the bottom
                        // and the ring icon has a true black center, so an aggressive cutoff
                        // eats real design detail. Since the destination background is also
                        // dark navy, any residual near-black margin blends in regardless.
const EDGE_SOFT = 8;   // soft alpha falloff band just above the cutoff, for anti-aliased edges

async function main() {
  const { data: src, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info; // channels = 3 (no alpha yet)

  const n = width * height;
  const isBg = new Uint8Array(n); // 1 = confirmed background via flood fill from the border
  const maxc = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const o = i * channels;
    maxc[i] = Math.max(src[o], src[o + 1], src[o + 2]);
  }

  // BFS flood fill from every border pixel, walking only through near-black pixels.
  // This only erases black that's *connected to the outside* — dark shadow pixels
  // enclosed inside a letter's own strokes are never reached, so they survive.
  const queue = new Int32Array(n);
  let qHead = 0, qTail = 0;
  function tryEnqueue(idx) {
    if (isBg[idx] === 0 && maxc[idx] <= NEAR_BLACK) {
      isBg[idx] = 1;
      queue[qTail++] = idx;
    }
  }
  for (let x = 0; x < width; x++) {
    tryEnqueue(x);
    tryEnqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    tryEnqueue(y * width);
    tryEnqueue(y * width + (width - 1));
  }
  while (qHead < qTail) {
    const idx = queue[qHead++];
    const x = idx % width;
    const y = (idx / width) | 0;
    if (x > 0) tryEnqueue(idx - 1);
    if (x < width - 1) tryEnqueue(idx + 1);
    if (y > 0) tryEnqueue(idx - width);
    if (y < height - 1) tryEnqueue(idx + width);
  }

  const out = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const o = i * channels;
    const oo = i * 4;
    out[oo] = src[o];
    out[oo + 1] = src[o + 1];
    out[oo + 2] = src[o + 2];
    if (isBg[i]) {
      out[oo + 3] = 0;
    } else {
      // Soft-edge any foreground pixel that's still dark and touches the
      // flood-filled region, so the background/letter boundary anti-aliases
      // smoothly instead of a hard cutout.
      const x = i % width;
      const y = (i / width) | 0;
      let nearBg = false;
      if (x > 0 && isBg[i - 1]) nearBg = true;
      else if (x < width - 1 && isBg[i + 1]) nearBg = true;
      else if (y > 0 && isBg[i - width]) nearBg = true;
      else if (y < height - 1 && isBg[i + width]) nearBg = true;
      if (nearBg && maxc[i] <= NEAR_BLACK + EDGE_SOFT) {
        out[oo + 3] = Math.round(((maxc[i] - NEAR_BLACK) / EDGE_SOFT) * 255);
      } else {
        out[oo + 3] = 255;
      }
    }
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .trim()
    .png({ compressionLevel: 9 })
    .toFile(OUT);

  const final = await sharp(OUT).metadata();
  console.log(`Wrote ${OUT} — ${final.width}x${final.height}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
