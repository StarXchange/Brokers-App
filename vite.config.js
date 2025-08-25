import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://gibsbrokersapi.newgibsonline.com',
        changeOrigin: true,
        secure: false // Add this if you're using HTTP instead of HTTPS
      }
    }
  }
})