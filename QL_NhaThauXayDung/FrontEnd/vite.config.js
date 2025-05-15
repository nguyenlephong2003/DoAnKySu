import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ["606f-58-187-190-107.ngrok-free.app"]
  },
  plugins: [
    tailwindcss(),
    react()
  ],
})
