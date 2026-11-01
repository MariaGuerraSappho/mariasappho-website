# mariasappho.com

Built with Astro. Each work is a folder in `src/content/works/` (an `index.md` plus images), each publication a folder in `src/content/research/`, and press and awards live in `src/data/press.ts`.

- `npm run build` builds the site into `dist/`.
- Pushing to `main` publishes it through `.github/workflows/deploy.yml`.
- `update-check.yml` runs on 1 January, May and September, comparing ORCID, YouTube, Bandcamp and GIO news with the site and opening an issue with what is new. Run `node scripts/check-updates.mjs` to do this by hand.
- Each release's Bandcamp player is set by the `audio` line in its `index.md`.
- `migration/` holds the scripts used to move the site from Wix; `migration/raw` is not committed.
