import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Локально, когда мы вызываем /api/proxy, 
      // Вите будет пересылать запрос на реальный бэкенд или ваш локальный сервер.
      '/api/proxy': {
        target: 'http://185.70.196.104', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy/, '/chat/ask'),
      },
    },
  },
})
