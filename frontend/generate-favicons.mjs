/**
 * Generates the browser favicons from the navbar logo (public/images/logo/svs_logo.svg).
 * Run once after the logo changes:  node generate-favicons.mjs
 *
 * Output goes to src/app/, where Next.js picks the files up by naming convention and
 * adds the <link rel="icon"> / <link rel="apple-touch-icon"> tags automatically:
 *   favicon.ico    16/32/48 px (PNG-in-ICO), for all browsers
 *   icon.png       192 px, high-resolution tab/bookmark icon
 *   apple-icon.png 180 px, iOS home screen
 *
 * The logo is black, so it sits on a white rounded tile to stay visible on dark tab bars.
 * The source SVG is ~270 KB (traced artwork), too heavy to serve as an SVG favicon.
 */
import sharp from "sharp";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(__dirname, "public/images/logo/svs_logo.svg");
const OUT_DIR = join(__dirname, "src/app");

const PADDING = 0.08; // fraction of the tile left empty on each side
const CORNER_RADIUS = 0.2; // fraction of the tile size

// Render the SVG large, then trim the empty margins around the artwork.
async function loadTrimmedLogo() {
  return sharp(SOURCE, { density: 300 })
    .resize({ width: 1536 })
    .flatten({ background: "#ffffff" })
    .trim({ threshold: 10 })
    .png()
    .toBuffer();
}

async function renderTile(logo, size, { rounded }) {
  const inner = Math.max(1, Math.round(size * (1 - 2 * PADDING)));
  const art = await sharp(logo)
    .resize(inner, inner, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  const radius = rounded ? Math.round(size * CORNER_RADIUS) : 0;
  const tile = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#ffffff"/></svg>`,
  );

  return sharp(tile)
    .composite([{ input: art, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// ICO container holding PNG images (supported by all current browsers).
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  const entries = [];
  let offset = 6 + 16 * images.length;
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette colours
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const logo = await loadTrimmedLogo();

const icoImages = [];
for (const size of [16, 32, 48]) {
  icoImages.push({ size, data: await renderTile(logo, size, { rounded: true }) });
}
writeFileSync(join(OUT_DIR, "favicon.ico"), buildIco(icoImages));
writeFileSync(join(OUT_DIR, "icon.png"), await renderTile(logo, 192, { rounded: true }));
// iOS applies its own rounded mask and fills transparency with black, so use a full square.
writeFileSync(join(OUT_DIR, "apple-icon.png"), await renderTile(logo, 180, { rounded: false }));

console.log("Favicons written to src/app: favicon.ico, icon.png, apple-icon.png");
