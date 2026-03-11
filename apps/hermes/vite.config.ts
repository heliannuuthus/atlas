import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom'],
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
    port: 16000,
    host: '0.0.0.0',
    open: false,
    allowedHosts: [
      'hermes.heliannuuthus.com',
      'localhost',
      '.heliannuuthus.com',
    ],
    hmr: {
      host: 'hermes.heliannuuthus.com',
    },
  },
})
