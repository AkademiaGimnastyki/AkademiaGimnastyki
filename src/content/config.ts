import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    image: z.string(),
    // Możesz dodać więcej pól według potrzeb
  }),
});

export const collections = {
  'blog': blogCollection,
};
