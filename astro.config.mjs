// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [sitemap()],
  site: 'https://gavelin.net',
  redirects: {
    '/en/forsaljningstransformation/': '/en/sales-transformation/',
    '/sv/sales-transformation/': '/sv/forsaljningstransformation/',
  },
  i18n: {
    defaultLocale: 'sv',
    locales: ['sv', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
