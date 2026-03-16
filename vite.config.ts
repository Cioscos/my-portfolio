import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { copyFileSync } from 'fs';

function ghPages404Plugin(): Plugin {
  return {
    name: 'gh-pages-404',
    closeBundle() {
      const outDir = resolve(__dirname, 'dist');
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), ghPages404Plugin()],
  base: '/my-portfolio/',
});
