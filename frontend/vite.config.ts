import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  // Important for GitHub Pages project sites to serve assets from /<repo>/
  base: process.env.VITE_BASE_PATH,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Slightly relax the warning limit now that we have better chunking
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router-dom')
            ) {
              return 'react-vendor'
            }

            if (
              id.includes('i18next') ||
              id.includes('react-i18next')
            ) {
              return 'i18n-vendor'
            }

            return 'vendor'
          }

          // Admin routes are lazy-loaded in App.tsx; forcing them into a named
          // chunk would drag shared code into it and get it preloaded on every
          // public page, so leave their splitting to Rollup.

          // Translation bundles are large, shared by every route, and change
          // independently of app code — keep them cacheable on their own.
          if (id.includes('/src/locales/') || id.includes('\\src\\locales\\')) {
            return 'locales'
          }
          return undefined
        },
      },
    },
  },
})
