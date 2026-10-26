import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: https://hortenli.github.io/ROTA-firmware/
export default defineConfig({
  plugins: [react()],
  base: '/ROTA-firmware/',
  build: {
    target: 'es2019',
  },
})
