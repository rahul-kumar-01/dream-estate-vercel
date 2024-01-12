import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     // '/api': {
  //     //   target: 'https://dream-estate-vercel-api-eight.vercel.app',
  //     //   changeOrigin: true,
  //     //   rewrite: (path) => path.replace(/^\/api/, ''),
  //     //   secure: false,
  //     // },
  //   },
  // },
});



//message : add server proxy 