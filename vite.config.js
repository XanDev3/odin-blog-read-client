import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], //settings below in order to host site on glitch.me
  build: {
    outDir: "build"
  },
  // glitch.me settings
/*   server: {
    host:"0.0.0.0",
    port:3000,
    strictPort: true,
    hmr: {
      clientPort: 443 // Run the websocket server on the SSL port
    }
  } */
 // localhost settings
  server: {
    host:"localhost",
    port:3000,
  }
})
