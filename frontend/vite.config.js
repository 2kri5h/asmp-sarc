// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0', 
//     port: 5173,
//     strictPort: true,
//   },
// })





import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  build: {
    sourcemap: false, // Disable source maps in production
  },
  // Add the following block
  resolve: {
    alias: {
      '@': '/src', // Adjust according to your project structure
    },
  },
  // Ensure proper routing for SPA
  // esbuild: {
  //   jsxInject: `import React from 'react'`,
  // },
})
