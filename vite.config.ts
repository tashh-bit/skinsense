import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { authPlugin } from './src/server/authPlugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), authPlugin()],
})

