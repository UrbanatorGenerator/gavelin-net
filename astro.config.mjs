// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [sitemap()],
  site: 'https://gavelin.net',
  i18n: {
    defaultLocale: 'sv',
    locales: ['sv', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
