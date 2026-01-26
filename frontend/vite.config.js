import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    watch: {
      usePolling: true, // Habilita el escaneo constante de archivos
    },
    host: true, // Permite conexiones externas al contenedor
    strictPort: true,
    port: 5173,
  },
  plugins: [react(), tailwindcss()],
})
