import { reactRouter } from '@react-router/dev/vite'
import type { UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const config: UserConfig = {
	plugins: [reactRouter(), tsconfigPaths()],
}

export default config
