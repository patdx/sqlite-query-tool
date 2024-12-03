import { reactRouter } from '@react-router/dev/vite'
import type { UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const config: UserConfig = {
	plugins: [
		reactRouter(),
		tsconfigPaths(),
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
}

export default config
