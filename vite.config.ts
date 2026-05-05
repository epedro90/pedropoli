import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to '/pedropoli/' for GitHub Pages deployment
// Change to '/' if deploying to username.github.io root
export default defineConfig({
  plugins: [react()],
  base: '/pedropoli/',
})
