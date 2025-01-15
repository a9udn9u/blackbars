import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [preact()],
  base: command === 'build' ? '/blackbars/' : '/', // GitHub adds URL prefix
  build: {
    outDir: 'docs', // GitHub Pages root
  },
}))
