import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    svgr({
      include: "**/*.svg?react",
    }),
    react({
      include: "**/*.{jsx,tsx}",
    })
  ],
  assetsInclude: ['**/*.svg'],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  define: {
    global: 'globalThis',
  }
  // Removed proxy configuration since we're using direct API calls
});