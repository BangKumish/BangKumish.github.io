import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://bangkumish.github.io',
  output: 'static',
  integrations: [svelte(), tailwind({ applyBaseStyles: false })],
  build: {
    assets: 'assets',
  },
});
