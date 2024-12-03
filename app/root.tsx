import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from 'react-router'

import type { Route } from './+types/root'
import stylesheet from './app.css?url'
import { Header } from './components/header'

export const links: Route.LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
]

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<main className="min-h-screen flex flex-col">
					<Header />
					<div className="flex-grow max-w-xl p-4 mx-auto w-full">
						{children}
					</div>
					<footer className="mt-4 mb-2 text-center text-sm text-gray-500">
						<div className="flex gap-2 justify-center">
							<a
								href="https://github.com/patdx/sqlite-query-tool"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-gray-700"
							>
								View on GitHub
							</a>
							<span>·</span>
							<a
								href="https://github.com/patdx"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-gray-700"
							>
								Created by patdx
							</a>
						</div>
					</footer>
				</main>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = 'Oops!'
	let details = 'An unexpected error occurred.'
	let stack: string | undefined

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error'
		details =
			error.status === 404
				? 'The requested page could not be found.'
				: error.statusText || details
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message
		stack = error.stack
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	)
}
