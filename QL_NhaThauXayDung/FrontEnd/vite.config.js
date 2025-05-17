import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ["64b9-2402-800-63a8-a6ba-bd33-389-8b82-9152.ngrok-free.app"]
  },
  plugins: [
    tailwindcss(),
    react()
  ],
})
