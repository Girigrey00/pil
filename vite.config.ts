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
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Proxy for Azure Blob Storage to bypass CORS during development
      '/azure-blob': {
        target: 'https://auranpunawlsa.blob.core.windows.net',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/azure-blob/, ''),
      }
    }
  }
})