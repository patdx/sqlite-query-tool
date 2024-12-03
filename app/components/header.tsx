import { NavLink } from 'react-router'

function HeaderLink({
	to,
	children,
}: {
	to: string
	children: React.ReactNode
}) {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				`px-4 py-2 rounded-md transition-colors ${
					isActive
						? 'bg-blue-100 text-blue-700 font-semibold'
						: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
				}`
			}
		>
			{children}
		</NavLink>
	)
}

export function Header() {
	return (
		<header className="mb-4 border-b shadow-sm bg-white">
			<nav className="max-w-xl mx-auto px-4 py-2 flex flex-wrap gap-2">
				<HeaderLink to="/">SQLite JSON Query Builder</HeaderLink>
				<HeaderLink to="/full-text-search">Full Text Search</HeaderLink>
			</nav>
		</header>
	)
}
