import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // WAŻNE: Zastąp ten adres URL docelową domeną Twojej strony przed wdrożeniem!
  site: 'https://www.akademiagimnastyki.pl',
  output: 'static',
  server: {
    port: 4321,
    host: '127.0.0.1'
  },
  integrations: [
    tailwind(),
    react({
      include: ['**/react/*', '**/gallery/*'],
    }),
    mdx(),
    sitemap(),
  ],
  vite: {
    ssr: {
      noExternal: ['lucide-react', 'lucide-astro']
    },
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
        awaitWriteFinish: {
          stabilityThreshold: 500,
          pollInterval: 100
        }
      },
      hmr: {
        protocol: 'ws',
        host: '127.0.0.1',
        port: 4321,
        clientPort: 4321,
        timeout: 5000,
        overlay: true,
        reconnect: true,
        path: 'hmr-ws'
      }
    }
  }
});
