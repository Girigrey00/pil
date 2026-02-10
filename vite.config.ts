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
        secure: false, // Set to false if the backend has a self-signed certificate
        // rewrite rule removed so /api is passed to the backend
      },
      // Proxy for Azure Blob Storage to bypass CORS during development
      '/azure-blob': {
        target: 'https://auranpunawlsa02.blob.core.windows.net',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/azure-blob/, ''),
      }
    }
  }
})