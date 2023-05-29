import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcss from 'vite-plugin-postcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
})
