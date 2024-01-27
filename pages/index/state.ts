import indentString from 'indent-string';
import { once } from 'lodash-es';
import { action, makeAutoObservable, remove, runInAction } from 'mobx';
import type { Column } from 'node-sql-parser';
import nodeSqlParser from 'node-sql-parser'; // https://vitejs.dev/guide/migration#ssr-externalized-modules-value-now-matches-production
import type { ChangeEvent } from 'react';

const getParser = once(() => {
  const { Parser } = nodeSqlParser;
  return new Parser();
});

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

export const state = makeAutoObservable(
  {
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

    addQuery() {
      const newQuery = { ...DEFAULT_QUERY };
      newQuery.name += '_' + (this.queries.length + 1);
      this.queries.push(newQuery);
    },
  },
  {},
  {
    autoBind: true,
  },
);

// TODO: is there a way to define the action more
// efficiently?
export const formatQueryAction = (query: Query) => async () => {
  const { formatDialect, sqlite } = await import('sql-formatter');

  const sql = formatDialect(query.sql, {
    dialect: sqlite,
    tabWidth: 2,
  });

  runInAction(() => {
    query.sql = sql;
  });
};

// TODO: is there a way to define the action more
// efficiently?
export const removeQueryAction = (index: number) =>
  action(() => {
    remove(state.queries, index as any);
  });

export function bindMobxInput<T, K extends keyof T>(model: T, field: K) {
  return {
    value: model[field],
    onChange: action(
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        (model as any)[field] = event.target.value;
      },
    ),
  };
}

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
    const parser = getParser();
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
    from (
${indentString(query.sql, 6)}
    )
  )`);
  }

  const result = `select json_object(
${parts.join(',\n')}
) as json_result`;

  return result;
}
