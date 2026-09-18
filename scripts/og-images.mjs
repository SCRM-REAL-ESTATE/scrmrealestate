/**
 * Builds the share cards under public/og.
 *
 * These are the images a link preview shows in iMessage, WhatsApp, Messenger,
 * LinkedIn and Slack. Before this every page fell back to a single /og.jpg, so
 * three different links pasted into one conversation looked like three copies
 * of the same message.
 *
 * Output is committed rather than generated at request time: a crawler fetches
 * the card once, from a cold URL, often with a short timeout, and a static JPEG
 * in public/ is the one thing guaranteed to answer instantly.
 *
 * Run with `node scripts/og-images.mjs` after changing a source photograph or
 * adding a page. It is deliberately not wired into `npm run build` — the inputs
 * change a few times a year, and a build should not depend on sharp being able
 * to re-encode a dozen photographs.
 *
 * 1200x630 is the size every platform crops from. Text is NOT drawn on these:
 * the preview already prints the page title underneath, and that title comes
 * from each page's own metadata (see src/lib/seo.ts), which is what makes the
 * label specific rather than generic.
 */

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "og");
const pub = (p) => path.join(ROOT, "public", p);

const W = 1200;
const H = 630;
const BRAND = "#1E62E0";

/** The lockup ships with "scrm" in a tone that vanishes on blue, so the mark is
 *  rebuilt as solid white from its own alpha channel. */
async function whiteLogo(width) {
  const { data, info } = await sharp(pub("logo.png"))
    .resize(width)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const alpha = Buffer.alloc(info.width * info.height);
  for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3];

  return {
    buffer: await sharp({
      create: { width: info.width, height: info.height, channels: 3, background: "#ffffff" },
    })
      .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
      .png()
      .toBuffer(),
    width: info.width,
    height: info.height,
  };
}

/** Darkens the lower third so a white mark stays legible over a bright room. */
const scrim = Buffer.from(
  `<svg width="${W}" height="${H}">
     <defs>
       <linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
         <stop offset="0" stop-color="#0d1b2e" stop-opacity="0.72"/>
         <stop offset="0.42" stop-color="#0d1b2e" stop-opacity="0.12"/>
         <stop offset="1" stop-color="#0d1b2e" stop-opacity="0"/>
       </linearGradient>
     </defs>
     <rect width="${W}" height="${H}" fill="url(#g)"/>
   </svg>`,
);

const cover = (file, w, h) =>
  sharp(pub(file)).resize(w, h, { fit: "cover", position: "centre" }).toBuffer();

const write = (pipeline, name) =>
  pipeline.jpeg({ quality: 86, chromaSubsampling: "4:4:4" }).toFile(path.join(OUT, `${name}.jpg`));

/** A single photograph, full bleed, with the mark resting bottom-left. */
async function photo(name, source) {
  const logo = await whiteLogo(260);
  await write(
    sharp(await cover(source, W, H)).composite([
      { input: scrim },
      { input: logo.buffer, left: 56, top: H - logo.height - 44 },
    ]),
    name,
  );
}

/** Before on the left, after on the right. The product, in one frame. */
async function split(name, before, after) {
  const half = W / 2;
  const logo = await whiteLogo(220);
  await write(
    sharp({ create: { width: W, height: H, channels: 3, background: BRAND } }).composite([
      { input: await cover(before, half, H), left: 0, top: 0 },
      { input: await cover(after, half, H), left: half, top: 0 },
      // A hairline rather than a slider handle: the seam has to read as
      // deliberate at thumbnail size, where anything finer disappears.
      {
        input: Buffer.from(`<svg width="6" height="${H}"><rect width="6" height="${H}" fill="#fff"/></svg>`),
        left: half - 3,
        top: 0,
      },
      { input: scrim },
      { input: logo.buffer, left: 40, top: H - 40 - Math.round((220 * 1779) / 3120) },
    ]),
    name,
  );
}

/** Three vertical crops on brand blue — the shape of the work, not one room. */
async function triptych(name, sources) {
  const pad = 34;
  const gap = 26;
  const cardW = Math.floor((W - pad * 2 - gap * 2) / 3);
  const cardH = H - pad * 2;
  const crops = await Promise.all(sources.map((s) => cover(s, cardW, cardH)));

  await write(
    sharp({ create: { width: W, height: H, channels: 3, background: BRAND } }).composite(
      crops.map((input, i) => ({ input, left: pad + i * (cardW + gap), top: pad })),
    ),
    name,
  );
}

/** For pages we have no honest photograph for. Better a clean brand card than
 *  an apartment interior standing in for a warehouse. */
async function brand(name) {
  const logo = await whiteLogo(620);
  await write(
    sharp({ create: { width: W, height: H, channels: 3, background: BRAND } }).composite([
      { input: logo.buffer, gravity: "centre" },
    ]),
    name,
  );
}

const L = (n) => `media/listings/listing-${n}.png`;
const E = (n) => `media/examples/listing/${n}.jpg`;
const S = (n) => `media/examples/staging/${n}.jpg`;

await mkdir(OUT, { recursive: true });

await Promise.all([
  photo("home", L("01")),
  photo("services", L("03")),
  photo("signature", E("05")),
  photo("agents", L("04")),
  photo("about", L("02")),
  photo("contact", L("13")),
  photo("book", L("11")),
  split("virtual-staging", S("living-before"), S("living-after")),
  triptych("work", [L("01"), L("08"), L("13")]),
  triptych("agencies", [L("09"), L("12"), L("16")]),
  brand("commercial"),
  brand("privacy"),
]);

console.log(`Wrote share cards to public/og`);
