import { action, remove } from 'mobx';
import { observer } from 'mobx-react-lite';
import { formatDialect, sqlite } from 'sql-formatter';
import { DEFAULT_QUERY, Query, parseOne, state } from './state';
import { FC } from 'react';

export const Page = observer(function Page() {
  const parsed = state.parsed;

  return (
    <div className="flex flex-col gap-2">
      <div>SQLite JSON Query Tool</div>
      <div className="p-2 border rounded prose">
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
        <>
          {index !== 0 ? <hr /> : null}
          <QueryEditor key={index} index={index} query={query} />
        </>
      ))}

      <hr />

      <div>
        <button
          onClick={action(() => {
            const newQuery = { ...DEFAULT_QUERY };
            newQuery.name += '_' + (state.queries.length + 1);
            state.queries.push(newQuery);
          })}
          className="p-1 border bg-gray-100 hover:bg-gray-200 active:bg-gray-200"
        >
          Add another query
        </button>
      </div>

      <hr />

      <div>Wrapped query:</div>

      <div className="font-mono rounded bg-blue-50 form-textarea w-full whitespace-pre-wrap text-sm">
        {parsed}
      </div>
    </div>
  );
});

const QueryEditor = observer(function QueryEditor({
  index,
  query,
}: {
  index: number;
  query: Query;
}) {
  const names = parseOne(query);

  return (
    <>
      <label>Query {index + 1}</label>
      <input
        type="text"
        className="form-input rounded"
        value={query.name}
        onChange={action((event) => (query.name = event.target.value))}
      />
      <textarea
        className="form-textarea w-full rounded"
        rows={10}
        value={query.sql}
        onChange={action((event) => (query.sql = event.target.value))}
      />
      <div className="flex gap-2">
        <button
          onClick={action(() => {
            query.sql = formatDialect(query.sql, {
              dialect: sqlite,
              tabWidth: 2,
            });
          })}
          className="p-1 border bg-gray-100 hover:bg-gray-200 active:bg-gray-200"
        >
          Format
        </button>
        <button
          onClick={action(() => {
            remove(state.queries, index as any);
          })}
          className="p-1 border bg-gray-100 hover:bg-gray-200 active:bg-gray-200"
        >
          Remove query
        </button>
      </div>
      <div>
        Detected columns: <span className="font-bold">{names?.join(', ')}</span>
      </div>
    </>
  );
});
