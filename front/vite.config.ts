import legacy from '@vitejs/plugin-legacy'
import devtools from 'solid-devtools/vite'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

const siteId = process.env.SITE

if (!siteId) {
	throw Error('SITE env var must be defined')
}

// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig({
	resolve: {
		alias: {
			'@ds': `${__dirname}/src/design-system`,
			'@context': `${__dirname}/src/context`,
			'@model': `${__dirname}/src/model`,
		},
	},
	plugins: [
		devtools({
			autoname: true,
		}),
		solid(),
		legacy({
			targets: ['defaults', 'not IE 11'],
		}),
	],
	define: {
		// biome-ignore lint/style/useNamingConvention: <explanation>
		__APP_VERSION__: JSON.stringify('v1.0.0'),
		'import.meta.env.SITE': JSON.stringify(process.env.SITE),
	},
	publicDir: `../sites/${siteId}/public`,
	server: {
		strictPort: true,
		open: true,
	},
	build: {
		outDir: `../sites/${siteId}/dist`,
		emptyOutDir: true,
		rollupOptions: {
			external: ['solid-js', '@solidjs/router', 'solid-markdown'],
			output: {
				paths: {
					'solid-js': 'https://esm.sh/solid-js@1.8.17',
					'@solidjs/router': 'https://esm.sh/@solidjs/router@0.13.3',
					'solid-markdown': 'https://esm.sh/solid-markdown@2.0.13',
				},
			},
		},
	},
	preview: {
		open: true,
	},
})
