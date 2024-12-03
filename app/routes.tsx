import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
	index('routes/home.tsx'),
	route('full-text-search', 'routes/full-text-search.tsx'),
] satisfies RouteConfig
