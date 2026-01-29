import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://pil.gernas.bankfab.com',
        changeOrigin: true,
        secure: false, // Set to false if the backend has a self-signed certificate or issues with SSL
      }
    }
  }
})