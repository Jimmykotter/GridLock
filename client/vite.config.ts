import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['animejs']
  },
  server: {
    port: 3000,    // your React app
    open: true,    // auto‑open in browser
    proxy: {
      // REST endpoints
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false
      },
      // GraphQL endpoint
      '/graphql': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
