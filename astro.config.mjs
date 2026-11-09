// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE, lastmod } from './src/lib/lastmod.mjs';

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
    // EQ-artikeln publicerades forst under kortare adresser den 2 augusti 2026 och
    // drogs tillbaka for att oversattningarna saknade a, a och o. Google hann hitta dem.
    '/en/insights/human-eq-and-ai-in-sales/': '/en/insights/navigating-the-nexus-of-human-eq-and-ai-in-sales/',
    '/sv/insikter/manniskans-eq-och-ai-i-forsaljning/': '/sv/insikter/navigera-mellan-mansklig-eq-och-ai-i-forsaljning/',
    '/es/perspectivas/eq-humana-e-ia-en-ventas/': '/es/perspectivas/navegando-el-nexo-entre-la-inteligencia-emocional-humana-y-la-ia-en-ventas/',
  },
  i18n: {
    defaultLocale: 'sv',
    locales: ['sv', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
