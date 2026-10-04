import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://dhirendra-art.vercel.app',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },
  devToolbar: {
    enabled: false
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});
