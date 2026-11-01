// Every four months: compare Maria's public record with the site and write update-report.md.
// Nothing here publishes anything. It only lists what is new, and asks what the web can't know.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

const ORCID = '0000-0003-3122-3357';
const CHANNELS = [
  { id: 'UCgQAhRdUik5GfXaZVrNexGQ', label: 'Your YouTube channel', mine: true },
  { id: 'UCQ-zb0-QV_ebXu6lI0WaiZg', label: 'Henry McPherson' },
];
const BANDCAMP = ['https://mariasappho.bandcamp.com/music', 'https://brutalust.bandcamp.com/music', 'https://scatterarchive.bandcamp.com/music'];
const BROWSER = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const IGNORE_FILE = 'src/data/update-ignore.json';

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, ' ').trim();
const html = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
const get = async (url, init) => {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, ...init });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
};

let site = '';
for (const dir of ['src/content/works', 'src/content/research', 'src/content/collaborations']) {
  for (const entry of readdirSync(dir)) {
    const file = `${dir}/${entry}/index.md`;
    if (existsSync(file)) site += readFileSync(file, 'utf8') + '\n';
  }
}
for (const file of ['src/data/now.ts', 'src/data/press.ts', 'src/data/projects.ts']) site += readFileSync(file, 'utf8');
const known = norm(site);
const ignored = (existsSync(IGNORE_FILE) ? JSON.parse(readFileSync(IGNORE_FILE, 'utf8')) : []).map(norm);
const isNew = (title) => {
  const t = norm(title).slice(0, 40);
  return t.length > 3 && !known.includes(t) && !ignored.some((i) => t.startsWith(i.slice(0, 40)));
};

const sections = [];
const failed = [];
async function check(name, run) {
  try {
    const items = await run();
    if (items.length) sections.push(`## ${name}\n\n${items.map((i) => `- ${i}`).join('\n')}`);
  } catch (e) {
    failed.push(`${name}: ${e.message}`);
  }
}

await check('New on ORCID', async () => {
  const { group } = await (await get(`https://pub.orcid.org/v3.0/${ORCID}/works`, { headers: { Accept: 'application/json' } })).json();
  return group.map((g) => g['work-summary'][0])
    .filter((w) => isNew(w.title.title.value))
    .map((w) => `${w.title.title.value} (${[w['publication-date']?.year?.value, w.type].filter(Boolean).join(', ')}) ${w.url?.value ?? ''}`.trim());
});

for (const c of CHANNELS) {
  await check(`New video: ${c.label}`, async () => {
    const xml = await (await get(`https://www.youtube.com/feeds/videos.xml?channel_id=${c.id}`)).text();
    return [...xml.matchAll(/<yt:videoId>(.*?)<\/yt:videoId>[\s\S]*?<title>(.*?)<\/title>/g)]
      .filter(([, id, title]) => !site.includes(id) && (c.mine || /sappho|maria/i.test(title)))
      .slice(0, 12)
      .map(([, id, title]) => `${html(title)} https://youtu.be/${id}`);
  });
}

for (const url of BANDCAMP) {
  await check(`New on ${new URL(url).hostname}`, async () => {
    const page = execFileSync('curl', ['-sL', '--max-time', '30', '-A', BROWSER, url], { encoding: 'utf8', maxBuffer: 20e6 });
    if (!/\/(album|track)\//.test(page)) throw new Error('Bandcamp would not show the release list, so check it by hand');
    const titles = [...page.matchAll(/href="(\/(?:album|track)\/[^"]+)"[\s\S]*?<p class="title">\s*([\s\S]*?)\s*<\/p>/g)];
    const clean = (t) => html(t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    return titles
      .filter(([, path, title]) => !site.includes(path) && isNew(clean(title)) && (!url.includes('scatterarchive') || /sappho|glasgow improvisers/i.test(clean(title))))
      .map(([, path, title]) => `${clean(title)} ${new URL(path, url).href}`);
  });
}

await check('Glasgow Improvisers Orchestra news', async () => {
  const page = await (await get('https://www.glasgowimprovisersorchestra.com/blog')).text();
  const links = [...page.matchAll(/href="(\/blog\/[a-z0-9-]+\/?)"[^>]*>([\s\S]*?)<\/a>/g)];
  const seen = new Set();
  return links
    .map(([, path, text]) => [path, html(text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())])
    .filter(([path, text]) => text.length > 8 && isNew(text) && !site.includes(path) && !seen.has(path) && seen.add(path))
    .slice(0, 8)
    .map(([path, text]) => `${text} https://www.glasgowimprovisersorchestra.com${path}`);
});

const today = new Date().toISOString().slice(0, 10);
const report = `# Website update check, ${today}

Reply with what you'd like added, and anything that should be ignored from now on.

${sections.length ? sections.join('\n\n') : 'Nothing new found online this time.'}

## Quick questions

1. What have you performed, shown or released since the last check?
2. What's coming up? Dates, venues and links.
3. Any new reviews, interviews, prizes, commissions or funding you can announce?
4. Any new photos, recordings or video you'd like added?
5. Has your job title or anything in your bio changed?
6. Anything on the Now page that has passed or should come off?
${failed.length ? `\n## Couldn't check\n\n${failed.map((f) => `- ${f}`).join('\n')}\n` : ''}`;
writeFileSync('update-report.md', report);
console.log(report);
