import indentString from 'indent-string';
import type { Column } from 'node-sql-parser';
import { Parser } from 'node-sql-parser';
import { useMemo, useState } from 'react';
import { formatDialect, sqlite } from 'sql-formatter';

function getColumnNames(columns: Column[]) {
  const names: string[] = [];

  for (const column of columns) {
    if (column.as) {
      names.push(column.as);
    } else if (column.expr.type === 'column_ref') {
      names.push(column.expr.column);
    } else {
      console.warn('Cannot parse column def', column);
    }
  }

  return names;
}

const DEFAULT_QUERY = `select
  id,
  employees.name,
  ranking as my_rank
from
  employees
limit
  2`;

function generateJsonQuery(queryName: string, columns: string[], sql: string) {
  const result = `select json_object(
  '${queryName}',
  (
    select
      json_group_array(
        json_object(${columns.map((col) => `'${col}', ${col}`).join(', ')})
      )
    from
      (
${indentString(sql, 8)}
      )
  )
) as json_result`;

  return result;
}

export function Page() {
  const [queryName, setQueryName] = useState('my_query_name');
  const [query, setQuery] = useState(DEFAULT_QUERY);

  const parsed = useMemo(() => {
    try {
      const parser = new Parser();
      const ast = parser.astify(query, { database: 'sqlite' });
      console.log(ast);
      const first = Array.isArray(ast) ? ast[0] : ast;
      if (first.type !== 'select') return undefined;
      const columns = first.columns;
      if (!Array.isArray(columns)) return undefined;
      const names = getColumnNames(columns);

      const jsonQuery = generateJsonQuery(queryName, names, query);

      return { names, jsonQuery };
    } catch (err) {
      console.warn(err);
      return undefined;
    }
  }, [query, queryName]);

  return (
    <div className="flex flex-col gap-2">
      <div>SQLite Query Tool</div>
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
        <p>
          Using the generated pattern below, you can also combine multiple
          unrelated queries. For example:
        </p>
        <div className="form-textarea whitespace-pre-wrap border-gray-200 font-mono text-sm">{`select json_object(
  'query_one',
  query_one,
  'query_two',
  query_two
) as json_result`}</div>
      </div>

      <label>Query name</label>
      <input
        type="text"
        className="form-input"
        value={queryName}
        onChange={(event) => setQueryName(event.target.value)}
      />
      <textarea
        className="form-textarea w-full"
        rows={10}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button
        onClick={() => {
          setQuery(
            formatDialect(query, {
              dialect: sqlite,
              tabWidth: 2,
            })
          );
        }}
        className="p-1 border bg-gray-100 hover:bg-gray-200 active:bg-gray-200"
      >
        Format
      </button>
      <div>
        Detected columns:{' '}
        <span className="font-bold">{parsed?.names.join(', ')}</span>
      </div>

      <div>Wrapped query:</div>

      <div className="form-textarea w-full whitespace-pre-wrap text-sm">
        {parsed?.jsonQuery}
      </div>
    </div>
  );
}
