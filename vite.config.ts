import { defineConfig } from 'vite';

// codemode1.github.io is a user site served from the domain root.
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    target: 'es2022',
  },
});
