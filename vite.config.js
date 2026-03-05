import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Saraha/',  
  server: {
    proxy: {
      // '/api': 'http://localhost:3000',
      '/api': 'http://ec2-13-51-203-134.eu-north-1.compute.amazonaws.com/',

    },
  },
})