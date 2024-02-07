import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader' ////svg

const __filename = fileURLToPath(import.meta.url);


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader({  ////svg
      svgoConfig: {}
    }) 
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',       //compile vue component from emiting
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@router': fileURLToPath(new URL('./src/router', import.meta.url)),
      '@classes': fileURLToPath(new URL('./src/classes', import.meta.url)),

      // '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
      '@globals': fileURLToPath(new URL('./src/globals', import.meta.url)),
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8001
  },
})
