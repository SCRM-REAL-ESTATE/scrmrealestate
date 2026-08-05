/**
 * sync-media.mjs — one command to publish every photo and video on the site.
 *
 * Drop your files into media-src/ (see folder table below), then run:
 *
 *   npm run media
 *
 * It will, for every file it finds:
 *   1. compress it to web size   (H.264 mp4 for video, JPG for photos)
 *   2. grab a poster frame       (videos only — so the gallery loads instantly)
 *   3. read its real dimensions  (so the gallery never crops your framing)
 *   4. upload it to Supabase Storage
 *   5. rewrite src/data/media.json — the list the Work gallery renders from
 *
 * Nothing needs to be edited by hand afterwards. Commit the regenerated
 * media.json and the new items appear on the site at the next deploy.
 *
 * ── Folders ────────────────────────────────────────────────────────────────
 *   media-src/property/      photos            → "Listing Photography"
 *   media-src/vertical/      9:16 video        → "Vertical Video"
 *   media-src/landscape/     16:9 video        → "Listing Video"
 *   media-src/carousels/     photos            → "Carousel Posts"
 *   media-src/detail/        photos or video   → "Stories & Detail"
 *   media-src/testimonials/  photos or video   → "Testimonials"
 *   media-src/agency/        photos or video   → "Brand & Team"
 *
 *   (media-src/listings/ still works as an alias for property/.)
 *
 * ── Setup (once) ───────────────────────────────────────────────────────────
 *   ffmpeg:   macOS  brew install ffmpeg
 *             Windows  winget install Gyan.FFmpeg
 *   env:      copy .env.example to .env.local and fill in
 *               SUPABASE_URL=https://<ref>.supabase.co
 *               SUPABASE_SERVICE_ROLE_KEY=<service role key>
 *             (Supabase → Project Settings → API. Never commit this key —
 *              .env.local is gitignored.)
 *
 * ── Flags ──────────────────────────────────────────────────────────────────
 *   --dry-run          show what would happen, touch nothing
 *   --force            re-compress and re-upload everything
 *   --no-upload        compress + rebuild the manifest only (offline)
 *   --only=vertical    limit to one folder (repeatable: --only=vertical,agency)
 *   --replace          rebuild the folders you supplied files for, dropping
 *                      anything no longer present (how you delete work)
 */

import { createClient } from "@supabase/supabase-js";
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

/* ── config ──────────────────────────────────────────────────────────────── */

const SRC_ROOT = "media-src"; // the drop folder — created on first run
const OUT_ROOT = "public/media-web";
const MANIFEST = "src/data/media.json";
const BUCKET = "media";

/**
 * Per-folder rules. `category` is what the gallery filter buttons match on;
 * `kind` is what the folder accepts — "mixed" takes photos and video together.
 */
const FOLDERS = {
  listings: { kind: "image", category: "listing" },
  property: { kind: "image", category: "listing" }, // alias — "Property Shots"
  vertical: { kind: "video", category: "vertical" },
  landscape: { kind: "video", category: "landscape" },
  carousels: { kind: "image", category: "carousel" },
  detail: { kind: "mixed", category: "detail" }, // detail / vertical shots → stories
  testimonials: { kind: "mixed", category: "testimonial" },
  agency: { kind: "mixed", category: "agency" }, // brand and team
};

const VIDEO_EXT = new Set([".mp4", ".mov", ".m4v", ".avi", ".mkv", ".webm"]);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);
/** Formats ffmpeg usually can't decode — worth a clear message rather than a crash. */
const UNSUPPORTED_EXT = new Set([".heic", ".heif", ".raw", ".cr2", ".cr3", ".nef", ".arw", ".dng"]);

/** Supabase free tier rejects anything larger. We warn well before that. */
const SIZE_LIMIT = 50 * 1024 * 1024;

const VIDEO_MAX_WIDTH = 1080; // 1080 wide: full-res for 9:16, 1080p for 16:9
const IMAGE_MAX_WIDTH = 2400;
const UPLOAD_CONCURRENCY = 4;

/* ── args ────────────────────────────────────────────────────────────────── */

const argv = process.argv.slice(2);
const has = (flag) => argv.includes(flag);
const DRY_RUN = has("--dry-run");
const FORCE = has("--force");
const NO_UPLOAD = has("--no-upload");
const REPLACE = has("--replace");
const ONLY = argv
  .filter((a) => a.startsWith("--only="))
  .flatMap((a) => a.slice("--only=".length).split(","))
  .filter(Boolean);

/* ── tiny helpers ────────────────────────────────────────────────────────── */

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/** "listing-2.png" sorts before "listing-10.png". */
const naturalSort = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

/** Strip spaces/uppercase/odd characters — storage keys and URLs stay clean. */
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Node doesn't read .env.local on its own — do it so `npm run media` just works. */
function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i.exec(line);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (process.env[key]) continue;
      process.env[key] = rawValue.trim().replace(/^["']|["']$/g, "");
    }
  }
}

async function hasFFmpeg() {
  try {
    await run("ffmpeg", ["-version"]);
    return true;
  } catch {
    return false;
  }
}

/** Real pixel dimensions, so the gallery can lay out without cropping. */
async function probeSize(file) {
  try {
    const { stdout } = await run("ffprobe", [
      "-v", "error",
      "-select_streams", "v:0",
      "-show_entries", "stream=width,height",
      "-of", "csv=p=0:s=x",
      file,
    ]);
    const [w, h] = stdout.trim().split("x").map(Number);
    if (w > 0 && h > 0) return { width: w, height: h };
  } catch {
    /* fall through */
  }
  return null;
}

/* ── compression ─────────────────────────────────────────────────────────── */

async function compressVideo(src, out) {
  await run("ffmpeg", [
    "-y", "-i", src,
    "-vcodec", "libx264",
    "-preset", "slow",
    "-crf", "26",
    "-maxrate", "2500k",
    "-bufsize", "5000k",
    "-vf", `scale='min(${VIDEO_MAX_WIDTH},iw)':-2`,
    "-acodec", "aac", "-b:a", "128k",
    "-movflags", "+faststart",
    "-loglevel", "error",
    out,
  ]);
}

async function makePoster(src, out) {
  // Seek 1s in — frame 0 is often a fade from black.
  await run("ffmpeg", [
    "-y", "-ss", "1", "-i", src,
    "-frames:v", "1",
    "-vf", `scale='min(${VIDEO_MAX_WIDTH},iw)':-2`,
    "-q:v", "4",
    "-loglevel", "error",
    out,
  ]);
}

async function compressImage(src, out) {
  await run("ffmpeg", [
    "-y", "-i", src,
    "-vf", `scale='min(${IMAGE_MAX_WIDTH},iw)':-2`,
    "-q:v", "3",
    "-loglevel", "error",
    out,
  ]);
}

/* ── discovery ───────────────────────────────────────────────────────────── */

/**
 * First run has nowhere to put files, so make the drop folder rather than
 * fail at someone who hasn't been told where it lives.
 */
function ensureSourceRoot() {
  if (existsSync(SRC_ROOT)) return true;

  for (const folder of Object.keys(FOLDERS)) {
    if (folder === "listings") continue; // legacy alias, no need to create it
    mkdirSync(join(SRC_ROOT, folder), { recursive: true });
  }

  console.log(c.bold(`\nCreated ${SRC_ROOT}/ with a folder for each kind of work:\n`));
  for (const [folder, { category }] of Object.entries(FOLDERS)) {
    if (folder === "listings") continue;
    console.log(`  ${SRC_ROOT}/${folder.padEnd(14)} ${c.dim(`→ ${category}`)}`);
  }
  console.log(c.dim(`\n  It's at: ${resolve(SRC_ROOT)}`));
  console.log(c.yellow("\n  Drop your photos and videos into those folders, then run this again.\n"));
  return false;
}

function findSources(root, folder) {
  const dir = join(root, folder);
  if (!existsSync(dir)) return { files: [], skipped: [] };

  const files = [];
  const skipped = [];
  for (const name of readdirSync(dir).sort(naturalSort)) {
    const path = join(dir, name);
    if (!statSync(path).isFile() || name.startsWith(".")) continue;

    const ext = extname(name).toLowerCase();
    if (UNSUPPORTED_EXT.has(ext)) skipped.push({ name, reason: `${ext} can't be read by ffmpeg — export as JPG or MP4 first` });
    else if (VIDEO_EXT.has(ext) || IMAGE_EXT.has(ext)) files.push(path);
    else skipped.push({ name, reason: `unrecognised file type (${ext || "no extension"})` });
  }
  return { files, skipped };
}

/* ── build: compress + probe, one folder at a time ───────────────────────── */

async function buildFolder(root, folder, ffmpeg) {
  const { kind, category } = FOLDERS[folder];
  const { files, skipped } = findSources(root, folder);

  for (const s of skipped) console.log(`  ${c.yellow("skip")} ${s.name} ${c.dim(`— ${s.reason}`)}`);
  if (files.length === 0) return { entries: [], uploads: [] };

  const outDir = join(OUT_ROOT, folder);
  if (!DRY_RUN) mkdirSync(outDir, { recursive: true });

  const entries = [];
  const uploads = [];
  const usedNames = new Set();

  for (const src of files) {
    const ext = extname(src).toLowerCase();
    const itemKind = VIDEO_EXT.has(ext) ? "video" : "image";
    if (kind !== "mixed" && itemKind !== kind) {
      console.log(
        `  ${c.yellow("skip")} ${basename(src)} ${c.dim(`— ${folder}/ holds ${kind}s, this is ${itemKind === "video" ? "a video" : "a photo"}`)}`
      );
      continue;
    }

    // A mixed folder can hold reel.mp4 (poster reel.jpg) and a photo also
    // called reel.jpg — de-duplicate so neither silently overwrites the other.
    let stem = slugify(basename(src, extname(src)));
    for (let n = 2; usedNames.has(stem); n++) stem = `${slugify(basename(src, extname(src)))}-${n}`;
    usedNames.add(stem);

    const outName = itemKind === "video" ? `${stem}.mp4` : `${stem}.jpg`;
    const out = join(outDir, outName);
    const posterName = `${stem}.jpg`;
    const poster = join(outDir, posterName);
    const label = `${folder}/${basename(src)}`;

    if (DRY_RUN) {
      console.log(`  ${c.dim("would process")} ${label} → ${folder}/${outName}`);
      continue;
    }

    // ── compress (or pass through if ffmpeg is unavailable)
    const needsBuild = FORCE || !existsSync(out);
    if (!ffmpeg) {
      // No ffmpeg: only usable if the source is already a web format.
      if (ext !== ".mp4" && ext !== ".jpg" && ext !== ".jpeg") {
        console.log(`  ${c.yellow("skip")} ${label} ${c.dim("— needs ffmpeg to convert")}`);
        continue;
      }
      writeFileSync(out, readFileSync(src));
    } else if (needsBuild) {
      process.stdout.write(`  ${c.dim("compressing")} ${label} … `);
      try {
        if (itemKind === "video") {
          await compressVideo(src, out);
          await makePoster(src, poster);
        } else {
          await compressImage(src, out);
        }
      } catch (err) {
        console.log(c.red("failed"));
        console.log(`    ${c.red(String(err.message || err).split("\n").slice(-3).join(" ").trim())}`);
        continue;
      }
      const before = statSync(src).size;
      const after = statSync(out).size;
      console.log(c.green(`${mb(before)} → ${mb(after)}`));
    } else {
      console.log(`  ${c.dim("cached")} ${label}`);
      if (itemKind === "video" && !existsSync(poster)) await makePoster(src, poster).catch(() => {});
    }

    const size = statSync(out).size;
    if (size > SIZE_LIMIT) {
      console.log(`  ${c.red("too large")} ${folder}/${outName} is ${mb(size)} — over the ${mb(SIZE_LIMIT)} bucket limit, skipping`);
      continue;
    }

    // ── record for the manifest
    const dims = (await probeSize(out)) ?? { width: 0, height: 0 };
    const entry = {
      type: itemKind,
      category,
      src: `${folder}/${outName}`,
      width: dims.width,
      height: dims.height,
    };
    const hasPoster = itemKind === "video" && existsSync(poster);
    if (hasPoster) entry.poster = `${folder}/${posterName}`;
    entries.push(entry);

    uploads.push({ key: `${folder}/${outName}`, path: out });
    if (hasPoster) uploads.push({ key: `${folder}/${posterName}`, path: poster });
  }

  return { entries, uploads };
}

/* ── upload ──────────────────────────────────────────────────────────────── */

function contentTypeFor(file) {
  if (file.endsWith(".mp4")) return "video/mp4";
  if (file.endsWith(".jpg") || file.endsWith(".jpeg")) return "image/jpeg";
  if (file.endsWith(".png")) return "image/png";
  if (file.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}

async function ensureBucket(supabase) {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw new Error(`Could not reach Supabase Storage: ${error.message}`);
  if (!buckets?.find((b) => b.name === BUCKET)) {
    console.log(`Creating public bucket "${BUCKET}" …`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: SIZE_LIMIT,
    });
    if (createError) throw createError;
  }
}

/** Existing object sizes, so unchanged files aren't re-uploaded every run. */
async function remoteSizes(supabase, folders) {
  const sizes = new Map();
  for (const folder of folders) {
    const { data } = await supabase.storage.from(BUCKET).list(folder, { limit: 1000 });
    for (const obj of data ?? []) {
      const size = obj.metadata?.size;
      if (typeof size === "number") sizes.set(`${folder}/${obj.name}`, size);
    }
  }
  return sizes;
}

async function uploadAll(supabase, uploads, folders) {
  const sizes = FORCE ? new Map() : await remoteSizes(supabase, folders);

  const pending = uploads.filter(({ key, path }) => sizes.get(key) !== statSync(path).size);
  const unchanged = uploads.length - pending.length;
  if (unchanged > 0) console.log(c.dim(`  ${unchanged} already up to date`));
  if (pending.length === 0) return { ok: 0, fail: 0 };

  let ok = 0;
  let fail = 0;
  let cursor = 0;

  async function worker() {
    while (cursor < pending.length) {
      const { key, path } = pending[cursor++];
      const { error } = await supabase.storage.from(BUCKET).upload(key, readFileSync(path), {
        contentType: contentTypeFor(path),
        upsert: true,
      });
      if (error) {
        console.log(`  ${c.red("✗")} ${key} ${c.dim(`— ${error.message}`)}`);
        fail++;
      } else {
        console.log(`  ${c.green("✓")} ${key}`);
        ok++;
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(UPLOAD_CONCURRENCY, pending.length) }, worker));
  return { ok, fail };
}

/* ── credentials ─────────────────────────────────────────────────────────── */

/**
 * Compression is the expensive part, so credentials get checked before it
 * rather than after — a bad URL used to surface as a stack trace once every
 * file had already been through ffmpeg.
 */
function credentialProblem() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url) return "SUPABASE_URL is missing from .env.local";
  if (!/^https:\/\/[^/]+\.supabase\.co\/?$/.test(url.trim())) {
    return `SUPABASE_URL doesn't look right ("${url}") — it should be https://<project>.supabase.co`;
  }
  if (!key) return "SUPABASE_SERVICE_ROLE_KEY is missing from .env.local";
  if (/your-/i.test(key)) return "SUPABASE_SERVICE_ROLE_KEY is still the example placeholder";
  if (!/^(sb_secret_|eyJ)/.test(key)) {
    return `SUPABASE_SERVICE_ROLE_KEY doesn't look like a key ("${key.slice(0, 20)}…") — it should start with sb_secret_`;
  }
  return null;
}

/* ── manifest ────────────────────────────────────────────────────────────── */

function readManifest() {
  try {
    return JSON.parse(readFileSync(MANIFEST, "utf8"));
  } catch {
    return { items: [] };
  }
}

/**
 * Additive by default: whatever is already published stays published, and a
 * rebuilt file simply replaces its own entry. So dropping one new reel into
 * media-src/ never removes the rest of the gallery — you can empty the drop
 * folder between runs without losing anything.
 *
 * With --replace, the folders that had source files this run are rebuilt from
 * scratch instead, which is how you remove something from the site.
 */
function mergeManifest(previous, built, touchedFolders, baseUrl) {
  const order = Object.values(FOLDERS).map((f) => f.category);
  const touched = new Set(touchedFolders.map((f) => FOLDERS[f].category));

  // Moving to a different bucket invalidates every entry that lived in the old
  // one. Repo-hosted files (src starting with "/") are unaffected.
  const movedBucket = Boolean(baseUrl) && previous.baseUrl !== baseUrl;

  // Repo-served ("/media/…") and fully-qualified ("https://…") entries stand on
  // their own; only bucket-relative keys depend on which bucket is current.
  const selfContained = (src) => src.startsWith("/") || /^https?:\/\//.test(src);

  const kept = (previous.items ?? []).filter((item) => {
    if (REPLACE && touched.has(item.category)) return false;
    if (movedBucket && !selfContained(item.src)) return false;
    return true;
  });

  if (movedBucket) {
    const dropped = (previous.items ?? []).length - kept.length;
    if (dropped > 0) {
      console.log(
        c.yellow(
          `\n  Storage moved to a new bucket — dropped ${dropped} entr${dropped === 1 ? "y" : "ies"} that lived in the old one.\n` +
            "  Anything you want to keep needs to be in media-src/ for this run."
        )
      );
    }
  }

  const merged = new Map(kept.map((item) => [item.src, item]));
  for (const item of built) merged.set(item.src, item);

  return [...merged.values()].sort(
    (a, b) => order.indexOf(a.category) - order.indexOf(b.category) || naturalSort(a.src, b.src)
  );
}

/* ── main ────────────────────────────────────────────────────────────────── */

async function main() {
  loadEnv();

  if (!ensureSourceRoot()) return;
  const root = SRC_ROOT;

  const folders = Object.keys(FOLDERS).filter((f) => (ONLY.length ? ONLY.includes(f) : true));
  if (folders.length === 0) {
    console.error(c.red(`--only did not match any folder. Valid: ${Object.keys(FOLDERS).join(", ")}`));
    process.exit(1);
  }

  const ffmpeg = await hasFFmpeg();
  console.log(c.bold("\nSCRM media sync"));
  console.log(c.dim(`  source   ${root}/`));
  console.log(c.dim(`  ffmpeg   ${ffmpeg ? "found" : "NOT FOUND — files will be passed through uncompressed"}`));
  if (!ffmpeg) {
    console.log(c.yellow("  Install it for compression + poster frames:"));
    console.log(c.yellow("    macOS    brew install ffmpeg"));
    console.log(c.yellow("    Windows  winget install Gyan.FFmpeg"));
  }
  if (DRY_RUN) console.log(c.yellow("  dry run — nothing will be written or uploaded"));

  const credentials = NO_UPLOAD || DRY_RUN ? null : credentialProblem();
  if (credentials) {
    console.log(c.red(`\n  Can't upload: ${credentials}`));
    console.log(c.yellow("  Fix it with:  npm run setup"));
    console.log(c.dim("  Or compress without uploading:  npm run media -- --no-upload\n"));
    process.exit(1);
  }

  const built = [];
  const uploads = [];
  const touched = [];
  let bucketUrl = null;

  for (const folder of folders) {
    console.log(`\n${c.bold(folder)}`);
    const { entries, uploads: fileUploads } = await buildFolder(root, folder, ffmpeg);
    if (entries.length === 0 && fileUploads.length === 0) {
      if (!DRY_RUN) console.log(c.dim("  nothing to do"));
      continue;
    }
    built.push(...entries);
    uploads.push(...fileUploads);
    touched.push(folder);
  }

  if (DRY_RUN) {
    console.log(c.dim("\nDry run complete.\n"));
    return;
  }

  // ── upload
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (NO_UPLOAD) {
    console.log(c.dim("\n--no-upload set, skipping Supabase."));
  } else if (credentialProblem()) {
    console.log(c.yellow(`\nSkipping upload — ${credentialProblem()}. Run \`npm run setup\`.`));
  } else if (uploads.length > 0) {
    console.log(`\n${c.bold("uploading")} ${c.dim(`${uploads.length} files → ${BUCKET}`)}`);
    bucketUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
    try {
      await ensureBucket(supabase);
    } catch (err) {
      console.log(c.red(`\n  ${err.message}`));
      console.log(
        c.yellow(
          "  Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local, and that you're online.\n" +
            "  Your compressed files are cached in public/media-web/ — re-running will pick up where this stopped.\n" +
            "  The manifest was left untouched so the live site keeps working."
        )
      );
      process.exit(1);
    }
    const { ok, fail } = await uploadAll(supabase, uploads, touched);
    console.log(`  ${ok} uploaded, ${fail} failed`);
    if (fail > 0) process.exitCode = 1;
  }

  // ── manifest
  //
  // The bucket URL is recorded here, alongside the files that went into it, so
  // the site knows where its media lives without anyone editing a hosting
  // dashboard. Committing the manifest is all it takes to point the site at a
  // new bucket.
  const previous = readManifest();
  const baseUrl = bucketUrl ?? previous.baseUrl;
  const items = mergeManifest(previous, built, touched, bucketUrl);
  mkdirSync("src/data", { recursive: true });
  writeFileSync(MANIFEST, `${JSON.stringify(baseUrl ? { baseUrl, items } : { items }, null, 2)}\n`);

  if (bucketUrl && bucketUrl !== previous.baseUrl) {
    console.log(`\n${c.green("✓")} media now served from ${bucketUrl}`);
  }

  const counts = items.reduce((acc, i) => ({ ...acc, [i.category]: (acc[i.category] ?? 0) + 1 }), {});
  console.log(`\n${c.green("✓")} ${MANIFEST} — ${items.length} items ${c.dim(JSON.stringify(counts))}`);
  console.log(c.dim("  Commit it and the new work is live on the next deploy.\n"));
}

main().catch((err) => {
  console.error(c.red(`\n${err.stack || err}\n`));
  process.exit(1);
});
