import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // im Devcontainer auf 0.0.0.0 lauschen, damit Port-Forwarding greift
    port: 5173,
    strictPort: true,
  },
});
