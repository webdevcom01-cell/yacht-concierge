import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Stable vendor chunk — long-term browser cache across deploys
          'vendor': ['react', 'react-dom', 'react-helmet-async'],
          // i18n runtime — changes less often than app code
          'i18n': ['i18next', 'react-i18next'],
        },
      },
    },
  },
})
