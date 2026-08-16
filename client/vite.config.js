import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Pinned so the dev origin always matches the API key's referrer restrictions
  server: {
    port: 5173,
    strictPort: true,
  },
});
