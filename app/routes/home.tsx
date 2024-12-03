import type { Route } from './+types/home'
import { Page } from '~/components/main'

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'SQLite Query Tool' },
		{
			name: 'description',
			content: 'Tools for experimenting with SQLite in the browser.',
		},
	]
}

export default function Home() {
	return <Page />
}
