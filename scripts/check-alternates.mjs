#!/usr/bin/env node
// Fails the build if an insight article is missing from the hreflang translation
// map, or if the map points at a page that does not exist.
//
// This exists because an article added by hand once slipped through without a
// map entry, which silently sent Google to three URLs that had never existed.
// The publishing pipeline maintains the map on its own; this catches the rest.

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const LANGS = {
  sv: { data: 'src/data/insikter.ts', prefix: '/sv/insikter/', dir: 'src/pages/sv/insikter' },
  en: { data: 'src/data/insights.ts', prefix: '/en/insights/', dir: 'src/pages/en/insights' },
  es: { data: 'src/data/perspectivas.ts', prefix: '/es/perspectivas/', dir: 'src/pages/es/perspectivas' },
};

const urlsFrom = (src) => [...src.matchAll(/url:\s*"([^"]+)"/g)].map((m) => m[1]);

function alternatesFrom(src) {
  const sets = [];
  const re = /\{\s*sv:\s*"([^"]+)"\s*,\s*en:\s*"([^"]+)"\s*,\s*es:\s*"([^"]+)"\s*\}/g;
  let m;
  while ((m = re.exec(src)) !== null) sets.push({ sv: m[1], en: m[2], es: m[3] });
  return sets;
}

function pageFor(url, lang) {
  const { prefix, dir } = LANGS[lang];
  return path.join(ROOT, dir, `${url.slice(prefix.length).replace(/\/$/, '')}.astro`);
}

const problems = [];

const sets = alternatesFrom(await readFile(path.join(ROOT, 'src/data/insight-alternates.ts'), 'utf8'));
const mapped = new Set(sets.flatMap((s) => [s.sv, s.en, s.es]));

// Every listed article must appear in the map.
for (const [lang, cfg] of Object.entries(LANGS)) {
  for (const url of urlsFrom(await readFile(path.join(ROOT, cfg.data), 'utf8'))) {
    if (!mapped.has(url)) {
      problems.push(`${url} saknas i insight-alternates.ts (listad i ${cfg.data})`);
    }
  }
}

// Every mapped URL must resolve to a page that actually exists.
for (const set of sets) {
  for (const lang of ['sv', 'en', 'es']) {
    const url = set[lang];
    if (!url.startsWith(LANGS[lang].prefix)) {
      problems.push(`${url} har fel prefix for ${lang} (vantade ${LANGS[lang].prefix})`);
      continue;
    }
    if (!existsSync(pageFor(url, lang))) {
      problems.push(`${url} finns i kartan men sidan saknas: ${path.relative(ROOT, pageFor(url, lang))}`);
    }
  }
}

if (problems.length) {
  process.stderr.write('\nhreflang-kartan ar inte komplett:\n');
  for (const p of problems) process.stderr.write(`  - ${p}\n`);
  process.stderr.write(
    `\n${problems.length} problem. Lagg till artikeln i src/data/insight-alternates.ts med sv/en/es-URL:erna.\n\n`
  );
  process.exit(1);
}

process.stdout.write(`hreflang-kartan ar komplett: ${sets.length} artiklar, ${mapped.size} URL:er\n`);
