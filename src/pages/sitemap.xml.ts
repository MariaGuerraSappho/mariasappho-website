import { getCollection } from 'astro:content';
import { themes } from '../data/site';

export async function GET({ site }: { site: URL }) {
  const paths = [
    '/', '/work/', '/work/all/', '/collaborations/', '/research/', '/now/', '/about/', '/press/',
    ...Object.keys(themes).map((t) => `/themes/${t}/`),
    ...(await getCollection('works')).map((e) => `/work/${e.id}/`),
    ...(await getCollection('research')).map((e) => `/research/${e.id}/`),
    ...(await getCollection('collaborations')).map((e) => `/collaborations/${e.id}/`),
  ];
  const urls = paths.map((p) => `<url><loc>${new URL(p, site)}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
}
