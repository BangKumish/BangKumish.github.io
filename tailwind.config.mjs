/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,md,mdx,svelte,ts}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        lg: '2rem',
      },
    },
    extend: {
      colors: {
        void: '#000000',
        panel: '#18181b',
        muted: '#71717a',
        signal: '#ffffff',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        pixel: ['Silkscreen', 'JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
