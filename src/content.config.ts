import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const folderId = ({ entry }: { entry: string }) => entry.replace(/\/index\.md$/, '');
const media = {
  videos: z.array(z.string()).default([]),
  audio: z.array(z.string()).default([]),
  links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
  oldPaths: z.array(z.string()).default([]),
};

const works = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/works', generateId: folderId }),
  schema: ({ image }) => z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    year: z.number().optional(),
    tags: z.array(z.string()).min(1),
    themes: z.array(z.string()).default([]),
    collaborations: z.array(z.string()).default([]),
    research: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
    cover: image().optional(),
    gallery: z.array(image()).default([]),
    scoreRequest: z.boolean().default(false),
    ...media,
  }),
});

const research = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/research', generateId: folderId }),
  schema: ({ image }) => z.object({
    title: z.string(),
    authors: z.string(),
    year: z.number().optional(),
    type: z.string(),
    venue: z.string().optional(),
    status: z.enum(['published', 'in-press']).default('published'),
    url: z.string().optional(),
    doi: z.string().optional(),
    themes: z.array(z.string()).default([]),
    works: z.array(z.string()).default([]),
    cover: image().optional(),
    ...media,
  }),
});

const collaborations = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/collaborations', generateId: folderId }),
  schema: ({ image }) => z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number().default(99),
    cover: image().optional(),
    gallery: z.array(image()).default([]),
    ...media,
  }),
});

export const collections = { works, research, collaborations };
