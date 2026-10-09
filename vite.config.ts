import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  build: {
    rollupOptions: {
      output: {
        onlyExplicitManualChunks: true,
        manualChunks(id) {
          // Keep controls shared by eager navigation and lazy demos out of route chunks.
          if (id.includes('/src/lib/components/ui/')) return 'ui-controls';
        }
      }
    }
  }
});
