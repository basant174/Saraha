import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "./",
  // base: '/Saraha/',  
  server: {
    proxy: {
      // '/api': 'http://localhost:3000',
      '/api': 'https://sara7a-app-pohu.onrender.com',

    },
  },
})