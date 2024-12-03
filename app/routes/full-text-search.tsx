import type { Route } from './+types/full-text-search'

export function meta({}: Route.MetaArgs) {
	return [
		{
			title: 'Full Text Search',
			description: 'SQLite full text search query builder',
		},
	]
}

export default function FullTextSearch() {
	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Full Text Search</h1>
			<p>Coming soon...</p>
		</div>
	)
}
