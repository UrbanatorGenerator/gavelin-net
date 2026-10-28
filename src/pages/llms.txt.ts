import type { APIRoute } from 'astro';
import template from '../llms/llms.txt?raw';
import { articles } from '../data/insights';
import { artiklar } from '../data/insikter';

// Built from the article data so every newly published insight is listed
// without anyone remembering to edit this file. Prose lives in src/llms/llms.txt.
const SITE = 'https://gavelin.net';

const insights = [
  '## Insights (English)',
  '',
  ...articles.map((a) => `- [${a.title}](${SITE}${a.url}): ${a.date}`),
  '',
  '## Insikter (svenska)',
  '',
  ...artiklar.map((a) => `- [${a.title}](${SITE}${a.url}): ${a.date}`),
].join('\n');

export const GET: APIRoute = () =>
  new Response(template.replace('{{insights}}', insights), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
