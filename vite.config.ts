import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
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
  },
  server: {
    proxy: {
      '/api/verify-token': {
        target: 'https://competitive-karly-edumastersuraj-75acc2f2.koyeb.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api/check-access': {
        target: 'https://competitive-karly-edumastersuraj-75acc2f2.koyeb.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
});