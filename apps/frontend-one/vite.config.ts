import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
  plugins: [
    // Gera o routeTree.gen.ts automaticamente a partir dos arquivos em src/routes/
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    // Resolve os aliases do tsconfig (@/...)
    tsconfigPaths(),
  ],
  server: { port: 5173 },
});
