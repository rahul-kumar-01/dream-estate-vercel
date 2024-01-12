import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://dream-estate-vercel-api-eight.vercel.app',
        secure: false,
      },
    },
  },
  plugins: [react()],
});
