import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import cdn from 'vite-plugin-cdn-import'


const site_id = process.env.SITE

if (!site_id) {
  throw Error("SITE env var must be defined")
}


export default defineConfig({
  plugins: [
    solid(),
    cdn({
      modules: [
        {
          name: 'solid-js',
          var: 'Solid',
          path: 'dist/solid.min.js',
        },

      ],
    }),],
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
  },
  preview: {
    open: true
  }
})
