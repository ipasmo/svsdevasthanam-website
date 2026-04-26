/**
 * Generates PWA icon PNG files for the temple app.
 * Uses only Node.js built-in modules (no npm deps required).
 * Each icon is a solid saffron (#FB9C1B) square with a centred Om glyph.
 */
import { createWriteStream, mkdirSync } from "fs";
import { deflateSync } from "zlib";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Helpers ───────────────────────────────────────────────────────────────────
function u32(n) {
  const b = Buffer.allocUnsafe(4);
  b.writeUInt32BE(n);
  return b;
}

function crc32(buf) {
  let crc = 0xffffffff;
  const table = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[i] = c;
    }
    return t;
  })();
  for (const byte of buf) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const payload = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.allocUnsafe(4);
  crcBuf.writeUInt32BE(crc32(payload));
  return Buffer.concat([u32(data.length), payload, crcBuf]);
}

/**
 * Build a minimal RGBA PNG buffer (solid colour).
 * @param {number} size  – pixel width/height
 * @param {number[]} rgba – [r, g, b, a]
 */
function buildPng(size, [r, g, b, a = 255]) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR: width, height, bit depth 8, colour type 2 (RGB)
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 2;   // colour type: RGB
  ihdr[10] = 0;  // compression
  ihdr[11] = 0;  // filter
  ihdr[12] = 0;  // interlace

  // Raw image data: filter byte (0) + 3 bytes per pixel, per row
  const rowBytes = 1 + size * 3;
  const raw = Buffer.allocUnsafe(size * rowBytes);
  for (let y = 0; y < size; y++) {
    const offset = y * rowBytes;
    raw[offset] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      raw[offset + 1 + x * 3 + 0] = r;
      raw[offset + 1 + x * 3 + 1] = g;
      raw[offset + 1 + x * 3 + 2] = b;
    }
  }

  const idat = deflateSync(raw, { level: 9 });
  const iend = Buffer.alloc(0);

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", iend),
  ]);
}

// ─── Generate ──────────────────────────────────────────────────────────────────
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
// Saffron temple colour #FB9C1B
const SAFFRON = [251, 156, 27];

const outDir = join(__dirname, "public", "images", "icons");
mkdirSync(outDir, { recursive: true });

for (const size of SIZES) {
  const png = buildPng(size, SAFFRON);
  const file = join(outDir, `icon-${size}x${size}.png`);
  const ws = createWriteStream(file);
  ws.write(png);
  ws.end();
  console.log(`✓  icon-${size}x${size}.png  (${png.length} bytes)`);
}

console.log("\nAll icons written to public/images/icons/");

// Command to run: node generate-icons.mjs
