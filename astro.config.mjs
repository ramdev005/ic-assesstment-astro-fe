// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  server: {
    port: 4321,
    host: true
  },
  vite: {
    preview: {
      host: '0.0.0.0',
      port: 4321,
      allowedHosts: ['icq-assessment-astro-fe.duckdns.org', 'localhost', '127.0.0.1'],
      strictPort: false
    },
    server: {
      host: '0.0.0.0',
      allowedHosts: ['icq-assessment-astro-fe.duckdns.org', 'localhost', '127.0.0.1'],
      strictPort: false
    }
  },
});
