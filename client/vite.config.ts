import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['animejs']
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // keep these so that /api and /graphql are forwarded to your back end
      '/graphql': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false
      }
    }
  }
  // …any other build or resolve settings you might have…
});
