import sharp from 'sharp';
import path from 'path';

const SRC = path.resolve('public/logo.png');
const OUT = SRC;

// Only touch the wordmark region (x >= TEXT_X_MIN), never the roller/blind
// icon graphic on the left, which has its own legitimate grey/silver tones.
const TEXT_X_MIN = 520;

// Within that region, only relight low-saturation (grey chrome) pixels —
// "VISION"/"BLINDS" sample at sat ~0.3-0.65, while "PRINTED"'s blue and the
// ring icon's colors sample at sat ~0.95-0.99, so 0.75 cleanly separates them.
const SAT_THRESHOLD = 0.75;
const BOOST = 0.86; // how far toward white the grey chrome pixels get pushed
const PURE_BLACK_FLOOR = 3; // excludes the ring icon's true (0,0,0) center hole, which
                             // must stay black, while still catching letter shading (~5+)

async function main() {
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let y = 0; y < height; y++) {
    for (let x = TEXT_X_MIN; x < width; x++) {
      const o = (y * width + x) * channels;
      const r = data[o], g = data[o + 1], b = data[o + 2], a = data[o + 3];
      if (a === 0) continue;
      const maxc = Math.max(r, g, b);
      const minc = Math.min(r, g, b);
      const sat = maxc === 0 ? 0 : (maxc - minc) / maxc;
      if (sat < SAT_THRESHOLD && maxc > PURE_BLACK_FLOOR) {
        data[o]     = Math.round(r + (255 - r) * BOOST);
        data[o + 1] = Math.round(g + (255 - g) * BOOST);
        data[o + 2] = Math.round(b + (255 - b) * BOOST);
      }
    }
  }

  const tmp = OUT + '.tmp.png';
  await sharp(data, { raw: { width, height, channels } }).png({ compressionLevel: 9 }).toFile(tmp);
  const fs = await import('fs/promises');
  await fs.rename(tmp, OUT);

  console.log(`Relit ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
