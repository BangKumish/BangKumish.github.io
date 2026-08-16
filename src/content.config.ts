import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    technologies: z.array(z.string()),
    repository: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    order: z.number().int().default(0),
  }),
});

const experiences = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    type: z.enum(['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Freelance']),
    startDate: z.coerce.date(),
    endDate: z.union([z.coerce.date(), z.literal('Present')]),
    location: z.string(),
    logo: z.string().optional(),
    badge: z.string().optional(),
    metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    highlights: z.array(z.string()),
    technologies: z.array(z.string()).default([]),
    order: z.number().int().default(0),
  }),
});

export const collections = { projects, experiences };
