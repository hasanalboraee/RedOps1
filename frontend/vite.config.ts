import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['@mui/material', '@emotion/react', '@emotion/styled']
  },
  build: {
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/],
      extensions: ['.js', '.cjs', '.ts', '.tsx']
    }
  }
})
