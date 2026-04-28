import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Airdidas/',
  build: {
    rollupOptions: {
      output: {
        // Split heavy libraries into separate cached chunks.
        // The browser re-downloads a chunk only when THAT chunk changes,
        // so Three.js (rarely updated) stays cached across deploys.
        manualChunks(id) {
          if (id.includes('three') || id.includes('@react-three')) {
            return 'three'       // ~600 kB — loaded only on pages that need 3D
          }
          if (id.includes('gsap')) {
            return 'gsap'        // ~80 kB — lazy-loaded with the pages that use it
          }
          if (id.includes('node_modules')) {
            return 'vendor'      // rest of node_modules in one cached chunk
          }
        },
      },
    },
  },
})
