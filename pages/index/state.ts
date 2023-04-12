import indentString from 'indent-string';
import { observable } from 'mobx';
import type { Column } from 'node-sql-parser';
import { Parser } from 'node-sql-parser';

export type Query = {
  name: string;
  sql: string;
};

export const DEFAULT_QUERY: Query = {
  name: 'my_query',
  sql: `select
  id,
  employees.name,
  ranking as my_rank
from
  employees
limit
  2`,
};

export const state = observable({
  queries: [DEFAULT_QUERY] as Query[],

  get parsed() {
    try {
      const jsonQuery = generateJsonQuery(this.queries);
      return jsonQuery;
    } catch (err) {
      console.warn(err);
      return undefined;
    }
  },
});

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

export function parseOne(query: Query) {
  try {
    const parser = new Parser();
    const ast = parser.astify(query.sql, { database: 'sqlite' });
    console.log(ast);
    const first = Array.isArray(ast) ? ast[0] : ast;
    if (!first) return undefined;
    if (first.type !== 'select') return undefined;
    const columns = first.columns;
    if (!Array.isArray(columns)) return undefined;
    const names = getColumnNames(columns);
    return names;
  } catch (err) {
    console.warn(err);
    return undefined;
  }
}

function generateJsonQuery(queries: Query[]) {
  const parts: string[] = [];

  for (const query of queries) {
    const columns = parseOne(query);
    if (!columns || columns.length === 0) continue;
    parts.push(`  '${query.name}',
    (
      select json_group_array(
        json_object(${columns.map((col) => `'${col}', ${col}`).join(', ')})
      )
      from
        (
  ${indentString(query.sql, 8)}
        )
    )`);
  }

  const result = `select json_object(
${parts.join(',\n')}
) as json_result`;

  return result;
}
