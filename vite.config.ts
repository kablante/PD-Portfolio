import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  // The site is served from https://kablante.github.io/PD-Portfolio/, so every
  // built asset URL needs that prefix. Kept in sync with the router basename
  // in main.tsx, which reads it back off import.meta.env.BASE_URL.
  base: '/PD-Portfolio/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
})
