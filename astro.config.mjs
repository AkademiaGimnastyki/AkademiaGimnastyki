import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    tailwind(),
    react({
      include: ['**/react/*'],
    }),
    mdx(),
    sitemap(),
  ],
  vite: {
    ssr: {
      noExternal: ['lucide-react', 'lucide-astro']
    },
    server: {
      hmr: {
        overlay: true,
        protocol: 'ws'
      }
    }
  }
});
