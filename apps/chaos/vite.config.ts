import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  server: {
    port: 19000,
    host: '0.0.0.0',
    open: false,
    allowedHosts: ['chaos.heliannuuthus.com', 'localhost', '.heliannuuthus.com'],
    hmr: {
      host: 'chaos.heliannuuthus.com',
    },
  },
})
