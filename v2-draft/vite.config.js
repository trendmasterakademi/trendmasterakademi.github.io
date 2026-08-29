import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const p = id.replace(/\\/g, '/');
            if (p.includes('/node_modules/react/') || 
                p.includes('/node_modules/react-dom/') || 
                p.includes('/node_modules/react-router/') || 
                p.includes('/node_modules/react-router-dom/') || 
                p.includes('/node_modules/react-i18next/') || 
                p.includes('/node_modules/scheduler/') ||
                p.includes('/node_modules/i18next/')) {
              return 'vendor-react';
            }
            if (p.includes('/node_modules/lucide-react/')) {
              return 'vendor-icons';
            }
            return 'vendor-misc';
          }
        }
      }
    }
  }
});
