import { sql } from 'kysely'
import { useEffect, useState } from 'react'
import { getDatabase } from '~/lib/seed-database'
import { db } from '~/lib/sqlocal'

export default function DatabaseViewer() {
	const [tables, setTables] = useState<string[]>([])
	const [selectedTable, setSelectedTable] = useState<string | null>(null)
	const [tableData, setTableData] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const initializeDatabase = async () => {
			try {
				// Seed the database
				const db = await getDatabase()

				// Get list of tables
				const result = await sql<{ name: string }>`
          SELECT name FROM sqlite_master 
          WHERE type='table' 
          AND name NOT LIKE 'sqlite_%'
        `.execute(db)

				setTables(result.rows.map((r) => r.name))
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'Failed to initialize database',
				)
			} finally {
				setLoading(false)
			}
		}

		initializeDatabase()
	}, [])

	useEffect(() => {
		const fetchTableData = async () => {
			if (!selectedTable) return

			try {
				setLoading(true)
				const result = await sql`
          SELECT * FROM ${sql.table(selectedTable)} 
          LIMIT 10
        `.execute(db)

				setTableData(result.rows)
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'Failed to fetch table data',
				)
			} finally {
				setLoading(false)
			}
		}

		fetchTableData()
	}, [selectedTable])

	if (error) {
		return <div className="p-4 text-red-600">Error: {error}</div>
	}

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">
				Database Viewer (Experimental)
			</h1>

			{loading && <div className="text-gray-600">Loading...</div>}

			<div className="flex gap-4">
				{/* Table List */}
				<div className="w-48">
					<h2 className="text-lg font-semibold mb-2">Tables</h2>
					<ul className="space-y-2">
						{tables.map((table) => (
							<li
								key={table}
								className={`cursor-pointer p-2 rounded ${
									selectedTable === table
										? 'bg-blue-500 text-white'
										: 'hover:bg-gray-100'
								}`}
								onClick={() => setSelectedTable(table)}
							>
								{table}
							</li>
						))}
					</ul>
				</div>

				{/* Table Data */}
				{selectedTable && (
					<div className="flex-1">
						<h2 className="text-lg font-semibold mb-2">
							{selectedTable} (showing first 10 rows)
						</h2>
						<div className="overflow-x-auto">
							<table className="min-w-full border-collapse border border-gray-300">
								<thead>
									{tableData.length > 0 && (
										<tr>
											{Object.keys(tableData[0]).map((column) => (
												<th
													key={column}
													className="border border-gray-300 p-2 bg-gray-50"
												>
													{column}
												</th>
											))}
										</tr>
									)}
								</thead>
								<tbody>
									{tableData.map((row, i) => (
										<tr key={i}>
											{Object.values(row).map((value: any, j) => (
												<td key={j} className="border border-gray-300 p-2">
													{value?.toString() ?? 'null'}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
