import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Proxy cho các API khu vực (areas) để tránh lỗi CORS trong development
      '/areas': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Proxy cho các API công dân (citizen) để tránh 404 trên Vite dev server
      '/citizen': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/enterprise/reports': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
