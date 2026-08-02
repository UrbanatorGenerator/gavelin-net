#!/usr/bin/env node
// Adds a cover image to insight articles that were written by hand and never got one.
// Downloads the LinkedIn cover, converts it to the same 1280x720 WebP the pipeline
// produces, and wires it into all three language versions of each article.
//
// Usage: node scripts/backfill-covers.mjs covers.json [--dry-run]
//
// covers.json maps the English slug to the LinkedIn image URL:
//   { "odysseus-becoming-a-leader": "https://media.licdn.com/dms/image/..." }

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const DIRS = {
  sv: { prefix: '/sv/insikter/', dir: 'src/pages/sv/insikter' },
  en: { prefix: '/en/insights/', dir: 'src/pages/en/insights' },
  es: { prefix: '/es/perspectivas/', dir: 'src/pages/es/perspectivas' },
};

function parseAlternates(src) {
  const sets = [];
  const re = /\{\s*sv:\s*"([^"]+)"\s*,\s*en:\s*"([^"]+)"\s*,\s*es:\s*"([^"]+)"\s*\}/g;
  let m;
  while ((m = re.exec(src)) !== null) sets.push({ sv: m[1], en: m[2], es: m[3] });
  return sets;
}

function urlToFile(url, lang) {
  const { prefix, dir } = DIRS[lang];
  if (!url.startsWith(prefix)) throw new Error(`url ${url} does not start with ${prefix}`);
  const slug = url.slice(prefix.length).replace(/\/$/, '');
  return path.join(dir, `${slug}.astro`);
}

// The hand-written articles are indented, the generated ones are flat, so every
// insertion copies the indentation of the line it anchors to.
function indentOf(line) {
  return (line.match(/^\s*/) || [''])[0];
}

function addCoverToSource(src, coverPath, file) {
  if (src.includes('const coverImage')) return { src, skipped: 'har redan bild' };

  const lines = src.split('\n');

  const importIdx = lines.findIndex((l) => l.includes("import Base from"));
  if (importIdx === -1) throw new Error(`${file}: hittar ingen Base-import`);

  const headlineIdx = lines.findIndex((l) => /^\s*"headline":/.test(l));
  if (headlineIdx === -1) throw new Error(`${file}: hittar ingen "headline" i schemat`);

  const schemaPropIdx = lines.findIndex((l) => /^\s*schema=\{schema\}/.test(l));
  if (schemaPropIdx === -1) throw new Error(`${file}: hittar ingen schema={schema} i Base-taggen`);

  const h1Idx = lines.findIndex((l) => l.includes('</h1>'));
  if (h1Idx === -1) throw new Error(`${file}: hittar ingen </h1>`);

  const h1Match = lines[h1Idx].match(/<h1>([\s\S]*?)<\/h1>/);
  const title = h1Match
    ? h1Match[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&mdash;/g, ' ').trim()
    : 'Urban Gavelin';
  const alt = title.replace(/"/g, '&quot;');

  // Insert from the bottom up so earlier indices stay valid.
  lines.splice(
    h1Idx + 1,
    0,
    `${indentOf(lines[h1Idx])}<img src={coverImage} alt="${alt}" width="1280" height="720" class="hero-img" />`
  );
  lines.splice(schemaPropIdx + 1, 0, `${indentOf(lines[schemaPropIdx])}image={coverImage}`);
  lines.splice(headlineIdx + 1, 0, `${indentOf(lines[headlineIdx])}"image": coverImage,`);
  lines.splice(importIdx + 1, 0, '', `const coverImage = ${JSON.stringify(coverPath)};`);

  return { src: lines.join('\n'), skipped: null };
}

async function buildCover(url, slug, dryRun) {
  const outRel = `public/images/insights/${slug}.webp`;
  const outAbs = path.join(ROOT, outRel);
  const res = await fetch(url, { headers: { 'user-agent': 'gavelin-net-insight-bot' } });
  if (!res.ok) throw new Error(`bildhämtning misslyckades: ${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (!dryRun) {
    await mkdir(path.dirname(outAbs), { recursive: true });
    await sharp(buf)
      .resize(1280, 720, { fit: 'cover', position: 'attention' })
      .webp({ quality: 82 })
      .toFile(outAbs);
  }
  return { rel: `/images/insights/${slug}.webp`, bytes: buf.length };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const mapPath = args.find((a) => !a.startsWith('--'));
  if (!mapPath) throw new Error('usage: node scripts/backfill-covers.mjs covers.json [--dry-run]');

  const covers = JSON.parse(await readFile(mapPath, 'utf8'));
  const sets = parseAlternates(await readFile(path.join(ROOT, 'src/data/insight-alternates.ts'), 'utf8'));

  const results = [];
  for (const [enSlug, imageUrl] of Object.entries(covers)) {
    const enUrl = `${DIRS.en.prefix}${enSlug}/`;
    const set = sets.find((s) => s.en === enUrl);
    if (!set) {
      results.push({ slug: enSlug, status: 'HOPPAS ÖVER', detail: `${enUrl} saknas i insight-alternates.ts` });
      continue;
    }

    const files = ['sv', 'en', 'es'].map((lang) => ({ lang, file: urlToFile(set[lang], lang) }));
    const missing = files.filter((f) => !existsSync(path.join(ROOT, f.file)));
    if (missing.length) {
      results.push({ slug: enSlug, status: 'HOPPAS ÖVER', detail: `saknade filer: ${missing.map((m) => m.file).join(', ')}` });
      continue;
    }

    const cover = await buildCover(imageUrl, enSlug, dryRun);
    const touched = [];
    for (const { file } of files) {
      const abs = path.join(ROOT, file);
      const { src, skipped } = addCoverToSource(await readFile(abs, 'utf8'), cover.rel, file);
      if (skipped) {
        touched.push(`${file} (${skipped})`);
        continue;
      }
      if (!dryRun) await writeFile(abs, src, 'utf8');
      touched.push(file);
    }
    results.push({ slug: enSlug, status: 'OK', detail: `${Math.round(cover.bytes / 1024)} KB källa -> ${cover.rel}`, files: touched });
  }

  for (const r of results) {
    process.stdout.write(`${r.status.padEnd(11)} ${r.slug}\n            ${r.detail}\n`);
    if (r.files) for (const f of r.files) process.stdout.write(`            ${f}\n`);
  }
  const ok = results.filter((r) => r.status === 'OK').length;
  process.stdout.write(`\n${ok}/${results.length} artiklar fick omslag${dryRun ? ' (dry run, inget skrivet)' : ''}\n`);
}

main().catch((err) => {
  process.stderr.write(`backfill-covers: ${err.message}\n`);
  process.exit(1);
});
