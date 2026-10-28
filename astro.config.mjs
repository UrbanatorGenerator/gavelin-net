// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const SITE = 'https://gavelin.net';
const PAGES = 'src/pages';

// lastmod per URL for the sitemap. Articles carry their own dateModified in the
// JSON-LD; other pages fall back to the last commit touching the file. A shallow
// clone would date every file to the newest commit, so git dates are skipped then
// rather than telling crawlers the whole site changed today.
function git(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

const gitDatesUsable = git(['rev-parse', '--is-shallow-repository']) === 'false';
const gitDate = (file) => (gitDatesUsable ? git(['log', '-1', '--format=%cs', '--', file]) : '') || undefined;

function pageFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? pageFiles(p) : e.name.endsWith('.astro') ? [p] : [];
  });
}

function urlFor(file) {
  const rel = path.relative(PAGES, file).replace(/\.astro$/, '').replace(/(^|\/)index$/, '');
  return `${SITE}/${rel}${rel ? '/' : ''}`;
}

const max = (...dates) => dates.filter(Boolean).sort().at(-1);

const lastmod = {};
const newestArticle = {};
for (const file of pageFiles(PAGES)) {
  const declared = readFileSync(file, 'utf8').match(/"dateModified":\s*"(\d{4}-\d{2}-\d{2})"/)?.[1];
  const url = urlFor(file);
  lastmod[url] = declared ?? gitDate(file);
  if (declared) {
    const lang = url.slice(SITE.length + 1, SITE.length + 3);
    newestArticle[lang] = max(newestArticle[lang], declared);
  }
}

// Home and insight index pages change whenever a new article is listed on them.
const listingPages = {
  sv: ['/sv/', '/sv/insikter/'],
  en: ['/en/', '/en/insights/'],
  es: ['/es/', '/es/perspectivas/'],
};
for (const [lang, urls] of Object.entries(listingPages)) {
  for (const u of urls) lastmod[SITE + u] = max(lastmod[SITE + u], newestArticle[lang]);
}
lastmod[`${SITE}/sv/`] = max(lastmod[`${SITE}/sv/`], gitDate('src/components/HomeSv.astro'));

export default defineConfig({
  integrations: [
    sitemap({
      // The root renders the Swedish homepage with /sv/ as canonical.
      filter: (page) => page !== `${SITE}/`,
      serialize(item) {
        const date = lastmod[item.url];
        return date ? { ...item, lastmod: date } : item;
      },
    }),
  ],
  site: SITE,
  redirects: {
    '/en/forsaljningstransformation/': '/en/sales-transformation/',
    '/sv/sales-transformation/': '/sv/forsaljningstransformation/',
    // Testet hette AI-beredskapstestet i en halv timme den 14 augusti 2026.
    // "Beredskap" bar totalforsvar och kris i svenskan, fel konnotation for ett
    // saljverktyg. URL:en hann ligga i sitemapen, darfor en omdirigering.
    '/sv/ai-beredskap/': '/sv/ai-mognad/',
  },
  i18n: {
    defaultLocale: 'sv',
    locales: ['sv', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
