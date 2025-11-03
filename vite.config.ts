import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'markdown-vendor': ['marked', 'dompurify'],
        },
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 600,
    // Enable minification (esbuild is faster than terser)
    minify: 'esbuild',
  },
  server: {
    port: 3000,
    open: true,
  },
})
