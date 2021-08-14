import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // Found solution here if there are issues in the future: https://github.com/vitejs/vite/issues/279
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  plugins: [
    Vue(),
    Pages({
      nuxtStyle: true,
      routeBlockLang: 'yaml',
      importMode: 'async',
    }),
  ],
  build: {
    sourcemap: true,
  },
  server: {
    // https: {
    //   key: fs.readFileSync('./certs/localhost-private.key'),
    //   cert: fs.readFileSync('./certs/localhost-public.cer'),
    // },
    proxy: {
      '/api': {
        target: 'https://apps.dts.cluster/seo-override/svc',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      },
    },
  },
})
