import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,  // fallback to next free port instead of crashing
    open: true,
    // Proxy /api/* → Express backend on port 3000.
    // This avoids all browser CORS issues in dev — cookies flow through seamlessly.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // Forward cookies between browser → Vite proxy → Express
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.warn('[vite-proxy] Backend not reachable:', err.message)
          })
        },
      },
    },
  },
})
