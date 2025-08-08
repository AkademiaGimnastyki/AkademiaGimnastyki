import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
// import sitemap from '@astrojs/sitemap'; // Używamy ręcznego sitemap.xml

export default defineConfig({
  // WAŻNE: Zastąp ten adres URL docelową domeną Twojej strony przed wdrożeniem!
  site: 'https://akademia-gimnastyki.pl',
  output: 'static',
  server: {
    port: 4321,
    host: '127.0.0.1'
  },
  // Konfiguracja optymalizacji obrazów
  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
    ],
    domains: ['images.ctfassets.net'],
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      }
    },
  },
  integrations: [
    tailwind(),
    react({
      include: ['**/react/*', '**/gallery/*'],
    }),
    mdx(),
    // sitemap(), // Używamy ręcznego sitemap.xml w public/
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
