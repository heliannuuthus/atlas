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
    port: 15000,
    host: '0.0.0.0',
    open: true,
    allowedHosts: [
      'atlas.heliannuuthus.com',
      'localhost',
      '.heliannuuthus.com',
    ],
    hmr: {
      host: 'atlas.heliannuuthus.com',
    },
  },
})
