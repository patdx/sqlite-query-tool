import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import {
	bindMobxInput,
	formatQueryAction,
	parseOne,
	removeQueryAction,
	state,
	type Query,
} from '~/components/state'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
	return [
		{
			title: 'SQLite JSON Query Builder',
			description: 'Build and combine SQLite queries with JSON output',
		},
	]
}

export default observer(function Page() {
	const parsed = state.parsed

	return (
		<div className="flex flex-col gap-2">
			<h1 className="text-2xl font-bold mb-4">SQLite JSON Query Builder</h1>
			<div className="p-2 border rounded-sm prose">
				<p>
					The <a href="https://www.sqlite.org/json1.html">JSON API of SQLite</a>{' '}
					allows new ways to combine multiple queries together. However, in
					order to create JSON objects, all of the column names must be known
					ahead of time. This can be a bit tedious to get right.
				</p>
				<p>
					This tool will try to auto-detect your column names and generate a
					wrapper query that is ready to go without any dependencies.
				</p>
			</div>

			{state.queries.map((query, index) => (
				<Fragment key={index}>
					{index !== 0 ? <hr /> : null}
					<QueryEditor index={index} query={query} />
				</Fragment>
			))}

			<hr />

			<div>
				<button
					onClick={state.addQuery}
					className="p-1 border bg-gray-100 hover:bg-gray-200 active:bg-gray-200"
				>
					Add another query
				</button>
			</div>

			<hr />

			<div>Wrapped query:</div>

			<div className="font-mono rounded-sm bg-blue-50 form-textarea w-full whitespace-pre-wrap text-sm">
				{parsed}
			</div>
		</div>
	)
})

const QueryEditor = observer(function QueryEditor({
	index,
	query,
}: {
	index: number
	query: Query
}) {
	const names = parseOne(query)

	return (
		<>
			<label>Query {index + 1}</label>
			<input
				type="text"
				className="form-input rounded-sm"
				{...bindMobxInput(query, 'name')}
			/>
			<textarea
				className="form-textarea w-full rounded-sm"
				rows={10}
				{...bindMobxInput(query, 'sql')}
			/>
			<div className="flex gap-2">
				<button
					onClick={formatQueryAction(query)}
					className="p-1 border bg-gray-100 hover:bg-gray-200 active:bg-gray-200"
				>
					Format
				</button>
				<button
					onClick={removeQueryAction(index)}
					className="p-1 border bg-gray-100 hover:bg-gray-200 active:bg-gray-200"
				>
					Remove query
				</button>
			</div>
			<div>
				Detected columns: <span className="font-bold">{names?.join(', ')}</span>
			</div>
		</>
	)
})
