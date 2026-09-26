import fs from 'node:fs';
import path from 'node:path';

/**
 * Server-only check for whether a file under /public actually exists.
 * Lets the custom-printed-blinds page render real images the moment
 * someone drops a correctly-named file into public/images/custom-printed/,
 * with no code change, and a clean placeholder otherwise.
 */
export function publicImageExists(relPath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), 'public', relPath));
}
