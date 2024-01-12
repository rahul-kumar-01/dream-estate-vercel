import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';  // Correct import for React support

export default defineConfig({
  plugins: [react()],  // Re-enable for React
  server: {
    proxy: {
      '/api': {
        target: 'https://dream-estate-vercel-api-eight.vercel.app',
        secure: true,  
        changeOrigin: true,
      },
    },
  },
});

