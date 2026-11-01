import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';

const old = JSON.parse(readFileSync('./src/data/redirects.json', 'utf8'));
const redirects = Object.fromEntries(Object.entries(old).filter(([from]) => /^[a-z0-9/-]+$/i.test(from)));

export default defineConfig({
  site: 'https://www.mariasappho.com',
  trailingSlash: 'ignore',
  redirects,
  build: { format: 'directory' },
});
