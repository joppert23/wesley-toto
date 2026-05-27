import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Base path wordt door GitHub Actions automatisch op de repo-naam gezet
// (zie .github/workflows/deploy.yml). Lokaal blijft het gewoon '/'.
export default defineConfig({
  plugins: [react(), tailwindcss()]
});
