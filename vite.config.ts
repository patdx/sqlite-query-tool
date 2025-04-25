import { reactRouter } from '@react-router/dev/vite'
import type { UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const config: UserConfig = {
	plugins: [
		reactRouter(),
		tsconfigPaths(),
		tailwindcss(),
		{
			name: 'configure-response-headers',
			configureServer: (server) => {
				server.middlewares.use((_req, res, next) => {
					res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
					res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
					next()
				})
			},
		},
	],
	optimizeDeps: {
		exclude: ['sqlocal'],
	},
	worker: {
		format: 'es',
	},
}

export default config
