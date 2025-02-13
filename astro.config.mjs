import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  server: {
    port: 4321
  },
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
      noExternal: ['lucide-react']
    },
    server: {
      hmr: {
        overlay: true,
        protocol: 'ws'
      }
    }
  }
});
