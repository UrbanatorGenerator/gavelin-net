import type { APIRoute } from 'astro';
import template from '../llms/llms-full.txt?raw';
import { articles } from '../data/insights';

// Built from the article data so every newly published insight is included.
// Prose lives in src/llms/llms-full.txt. Swedish and Spanish versions of each
// article are linked from its page via hreflang.
const SITE = 'https://gavelin.net';

const insights = [
  '## Key insights and published articles',
  '',
  ...articles.map((a) =>
    [`### ${a.title} (${a.date})`, `${a.category}. ${a.description}`, `URL: ${SITE}${a.url}`, ''].join('\n')
  ),
].join('\n').trimEnd();

export const GET: APIRoute = () =>
  new Response(template.replace('{{insights}}', insights), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
