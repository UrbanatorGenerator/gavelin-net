#!/usr/bin/env node
// Generates a trilingual insight article (sv/en/es) from a JSON spec.
// Usage: node scripts/new-insight.mjs spec.json [--dry-run] [--force]

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CALENDLY = 'https://calendly.com/urbgav/30min';
const LINKEDIN = 'https://www.linkedin.com/in/urbangavelin/';
const SITE = 'https://gavelin.net';

const LOCALES = {
  sv: {
    dir: 'src/pages/sv/insikter',
    urlBase: '/sv/insikter/',
    dataFile: 'src/data/insikter.ts',
    exportName: 'artiklar',
    typeName: 'Artikel',
    authorHref: '/sv/urban-gavelin/',
    byline: 'Av',
    origin: (d) => `Publicerat ursprungligen som LinkedIn-nyhetsbrev ${d}.`,
    follow: 'Följ Urban Gavelin på LinkedIn',
    relatedHeading: 'Relaterat',
    moreLabel: 'Fler insikter',
    faqHeading: 'Vanliga frågor',
    formatDate: (y, m, d) =>
      `${d} ${['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'][m - 1]} ${y}`,
  },
  en: {
    dir: 'src/pages/en/insights',
    urlBase: '/en/insights/',
    dataFile: 'src/data/insights.ts',
    exportName: 'articles',
    typeName: 'Article',
    authorHref: '/en/urban-gavelin/',
    byline: 'By',
    origin: (d) => `Originally published as a LinkedIn newsletter ${d}.`,
    follow: 'Follow Urban Gavelin on LinkedIn',
    relatedHeading: 'Related',
    moreLabel: 'More insights',
    faqHeading: 'Frequently asked questions',
    formatDate: (y, m, d) =>
      `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1]} ${d}, ${y}`,
  },
  es: {
    dir: 'src/pages/es/perspectivas',
    urlBase: '/es/perspectivas/',
    dataFile: 'src/data/perspectivas.ts',
    exportName: 'articulos',
    typeName: 'Articulo',
    authorHref: '/es/urban-gavelin/',
    byline: 'Por',
    origin: (d) => `Publicado originalmente como boletín de LinkedIn el ${d}.`,
    follow: 'Sigue a Urban Gavelin en LinkedIn',
    relatedHeading: 'Relacionados',
    moreLabel: 'Más perspectivas',
    faqHeading: 'Preguntas frecuentes',
    formatDate: (y, m, d) =>
      `${d} de ${['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'][m - 1]} de ${y}`,
  },
};

// Astro parses { } in markup as JSX expressions, so any brace in prose has to
// be neutralised or the build fails on otherwise valid text.
const safeMarkup = (s) => String(s).replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const textNode = (s) => safeMarkup(String(s).replace(/&(?!(?:[a-zA-Z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));

function parseDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`date must be YYYY-MM-DD, got: ${iso}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

// Reads the existing entries out of a data .ts file, newest first.
function parseDataFile(src) {
  const entries = [];
  const re = /\{\s*url:\s*("(?:[^"\\]|\\.)*")\s*,\s*title:\s*("(?:[^"\\]|\\.)*")/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    entries.push({ url: JSON.parse(m[1]), title: JSON.parse(m[2]) });
  }
  return entries;
}

function insertIntoDataFile(src, loc, entry) {
  const anchor = `export const ${loc.exportName}: ${loc.typeName}[] = [`;
  const at = src.indexOf(anchor);
  if (at === -1) throw new Error(`could not find "${anchor}" in ${loc.dataFile}`);
  const block =
    `\n  {\n` +
    `    url: ${JSON.stringify(entry.url)},\n` +
    `    title: ${JSON.stringify(entry.title)},\n` +
    `    description: ${JSON.stringify(entry.description)},\n` +
    `    date: ${JSON.stringify(entry.date)},\n` +
    `    category: ${JSON.stringify(entry.category)},\n` +
    `  },`;
  const cut = at + anchor.length;
  return src.slice(0, cut) + block + src.slice(cut);
}

// Keeps hreflang correct: slugs differ per language, so each article needs an
// explicit sv/en/es triple in the alternates map.
function insertIntoAlternates(src, urls) {
  const anchor = 'export const alternateSets: AlternateSet[] = [';
  const at = src.indexOf(anchor);
  if (at === -1) throw new Error(`could not find "${anchor}" in insight-alternates.ts`);
  if (src.includes(JSON.stringify(urls.en))) return src;
  const block = `\n  { sv: ${JSON.stringify(urls.sv)}, en: ${JSON.stringify(urls.en)}, es: ${JSON.stringify(urls.es)} },`;
  const cut = at + anchor.length;
  return src.slice(0, cut) + block + src.slice(cut);
}

function renderSections(sections) {
  return sections
    .map((s) => {
      const heading = s.heading ? `<h2>${textNode(s.heading)}</h2>\n` : '';
      return `<div class="section">\n${heading}${safeMarkup(s.html).trim()}\n</div>`;
    })
    .join('\n\n');
}

function renderFaq(faq, loc) {
  if (!faq || faq.length === 0) return '';
  const items = faq
    .map(
      (f) =>
        `<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question" style="margin-bottom:1.5rem;">\n` +
        `<h3 itemprop="name">${textNode(f.q)}</h3>\n` +
        `<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">\n` +
        `<p itemprop="text">${textNode(f.a)}</p>\n` +
        `</div>\n</div>`
    )
    .join('\n\n');
  return (
    `\n\n<div class="section">\n<h2>${textNode(loc.faqHeading)}</h2>\n` +
    `<div itemscope itemtype="https://schema.org/FAQPage">\n\n${items}\n\n</div>\n</div>`
  );
}

function renderArticle({ loc, a, coverImage, iso, dateLabel, related, linkedinUrl }) {
  const url = `${SITE}${loc.urlBase}${a.slug}/`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    image: coverImage,
    description: a.description,
    datePublished: iso,
    dateModified: iso,
    author: { '@type': 'Person', name: 'Urban Gavelin', url: `${SITE}${loc.authorHref}` },
    publisher: { '@type': 'Organization', name: 'Powersales Communication', url: 'https://powersales.se' },
    keywords: a.keywords ?? [],
    url,
  };

  const relatedList = [
    ...related.map((r) => `<li><a href="${attr(r.url)}">${textNode(r.title)}</a></li>`),
    `<li><a href="${attr(loc.urlBase)}">${textNode(loc.moreLabel)}</a></li>`,
  ].join('\n');

  const originLine = linkedinUrl
    ? `<a href="${attr(linkedinUrl)}" style="color: var(--color-text-muted);">${textNode(loc.origin(dateLabel))}</a>`
    : textNode(loc.origin(dateLabel));

  return `---
import Base from '../../../layouts/Base.astro';

const coverImage = ${JSON.stringify(coverImage)};

const schema = ${JSON.stringify(schema, null, 0)};
---

<Base
title="${attr(a.title)} | Urban Gavelin"
description="${attr(a.description)}"
lang="${loc.lang}"
schema={schema}
image={coverImage}
>

<p style="color: var(--color-text-muted); font-size: 0.9rem;">
${textNode(loc.byline)} <a href="${attr(loc.authorHref)}" rel="author">Urban Gavelin</a>, <time datetime="${iso}">${textNode(dateLabel)}</time>, ${textNode(a.category)}
</p>
<h1>${textNode(a.title)}</h1>
<img src={coverImage} alt="${attr(a.title)}" width="1280" height="720" class="hero-img" />
<p class="lead"><strong>${safeMarkup(a.lead)}</strong></p>

${renderSections(a.sections)}${renderFaq(a.faq, loc)}

<div class="section">
<a href="${CALENDLY}" class="btn" target="_blank" rel="noopener">${textNode(a.cta)}</a>
</div>

<div class="section" style="border-top: 1px solid var(--color-border); padding-top: 2rem; margin-top: 3rem;">
<p style="color: var(--color-text-muted); font-size: 0.9rem;">${originLine} <a href="${LINKEDIN}" style="color: var(--color-text-muted);">${textNode(loc.follow)} &rarr;</a></p>
<h3 style="margin-top: 1.5rem;">${textNode(loc.relatedHeading)}</h3>
<ul>
${relatedList}
</ul>
</div>

</Base>
`;
}

async function buildCover(source, imageSlug, dryRun) {
  const outRel = `public/images/insights/${imageSlug}.webp`;
  const outAbs = path.join(ROOT, outRel);
  let input;
  if (/^https?:\/\//i.test(source)) {
    const res = await fetch(source, { headers: { 'user-agent': 'gavelin-net-insight-bot' } });
    if (!res.ok) throw new Error(`image fetch failed: ${res.status} ${res.statusText}`);
    input = Buffer.from(await res.arrayBuffer());
  } else {
    input = await readFile(path.isAbsolute(source) ? source : path.join(ROOT, source));
  }
  if (!dryRun) {
    await mkdir(path.dirname(outAbs), { recursive: true });
    await sharp(input)
      .resize(1280, 720, { fit: 'cover', position: 'attention' })
      .webp({ quality: 82 })
      .toFile(outAbs);
  }
  return `/images/insights/${imageSlug}.webp`;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force');
  const specPath = args.find((a) => !a.startsWith('--'));
  if (!specPath) throw new Error('usage: node scripts/new-insight.mjs spec.json [--dry-run] [--force]');

  const spec = JSON.parse(await readFile(specPath, 'utf8'));
  const [y, m, d] = parseDate(spec.date);
  const iso = spec.date;
  const imageSlug = spec.imageSlug ?? spec.articles.en.slug;

  for (const lang of ['sv', 'en', 'es']) {
    const a = spec.articles?.[lang];
    if (!a) throw new Error(`spec.articles.${lang} is missing`);
    for (const field of ['slug', 'title', 'description', 'category', 'lead', 'sections', 'cta']) {
      if (!a[field]) throw new Error(`spec.articles.${lang}.${field} is missing`);
    }
    if (!/^[a-z0-9][a-z0-9-]*$/.test(a.slug)) throw new Error(`spec.articles.${lang}.slug is not url-safe: ${a.slug}`);
  }

  const coverImage = await buildCover(spec.imageSource, imageSlug, dryRun);
  const written = [];
  const urls = [];
  const localUrls = Object.fromEntries(
    ['sv', 'en', 'es'].map((l) => [l, `${LOCALES[l].urlBase}${spec.articles[l].slug}/`])
  );

  for (const lang of ['sv', 'en', 'es']) {
    const loc = { ...LOCALES[lang], lang };
    const a = spec.articles[lang];
    const pageRel = path.join(loc.dir, `${a.slug}.astro`);
    const pageAbs = path.join(ROOT, pageRel);
    const url = `${loc.urlBase}${a.slug}/`;

    if (existsSync(pageAbs) && !force) throw new Error(`${pageRel} already exists (use --force to overwrite)`);

    const dataAbs = path.join(ROOT, loc.dataFile);
    let dataSrc = await readFile(dataAbs, 'utf8');
    const existing = parseDataFile(dataSrc);
    const related = existing.filter((e) => e.url !== url).slice(0, 3);

    const page = renderArticle({
      loc,
      a,
      coverImage,
      iso,
      dateLabel: loc.formatDate(y, m, d),
      related,
      linkedinUrl: spec.linkedinUrl,
    });

    if (existing.some((e) => e.url === url)) {
      if (!force) throw new Error(`${url} already listed in ${loc.dataFile} (use --force)`);
    } else {
      dataSrc = insertIntoDataFile(dataSrc, loc, {
        url,
        title: a.title,
        description: a.description,
        date: loc.formatDate(y, m, d),
        category: a.category,
      });
    }

    if (!dryRun) {
      await mkdir(path.dirname(pageAbs), { recursive: true });
      await writeFile(pageAbs, page, 'utf8');
      await writeFile(dataAbs, dataSrc, 'utf8');
    }
    written.push(pageRel, loc.dataFile);
    urls.push(`${SITE}${url}`);
  }

  const altRel = 'src/data/insight-alternates.ts';
  const altAbs = path.join(ROOT, altRel);
  const altSrc = insertIntoAlternates(await readFile(altAbs, 'utf8'), localUrls);
  if (!dryRun) await writeFile(altAbs, altSrc, 'utf8');
  written.push(altRel);

  const result = { dryRun, coverImage, files: written, urls };
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

main().catch((err) => {
  process.stderr.write(`new-insight: ${err.message}\n`);
  process.exit(1);
});
