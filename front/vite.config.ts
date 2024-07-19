import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import legacy from '@vitejs/plugin-legacy'

const site_id = process.env.SITE

if (!site_id) {
  throw Error("SITE env var must be defined")
}


export default defineConfig({
  plugins: [
    solid(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    })
  ],
  define: {
    __APP_VERSION__: JSON.stringify('v1.0.0'),
    'import.meta.env.SITE': JSON.stringify(process.env.SITE)

  },
  publicDir: `../sites/${site_id}/public`,
  server: {
    strictPort: true,
    open: true
  },
  build: {
    outDir: `../sites/${site_id}/dist`,
    emptyOutDir: true,
    rollupOptions: {
      external: ['solid-js'],
      output: {
        paths: {
          'solid-js': 'https://esm.sh/solid-js@1.8.17'
        }
      }
    }
  },
  preview: {
    open: true
  }
})
