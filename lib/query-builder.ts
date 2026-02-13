import { and, asc, Column, desc, eq, ilike, InferSelectModel, or, sql, SQL } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { db } from "./db";
import { calculateOffset } from "./pagination";
import { IndexQueryParamsType } from "@/types/query-params";

type PaginationParams<
  TTable extends PgTable,
  TSearchable extends keyof TTable,
  TFilterable extends keyof TTable,
  TSortable extends keyof TTable,
> = {
  table: TTable;
  queryParams: IndexQueryParamsType & Partial<Record<TFilterable, unknown>>;
  searchableColumns: readonly TSearchable[];
  filterableColumns: readonly TFilterable[];
  sortableColumns: readonly TSortable[];
};

type BuildWhereParams<
  TTable extends PgTable,
  TSearchable extends keyof TTable,
  TFilterable extends keyof TTable,
> = {
  table: TTable;
  queryParams: {
    search?: string;
  } & Partial<Record<TFilterable, unknown>>;
  searchableColumns: readonly TSearchable[];
  filterableColumns: readonly TFilterable[];
};

export const buildGenericWhereClause = <
  TTable extends PgTable,
  TSearchable extends keyof TTable,
  TFilterable extends keyof TTable,
>({
  table,
  queryParams,
  searchableColumns,
  filterableColumns,
}: BuildWhereParams<TTable, TSearchable, TFilterable>) => {
  const { search } = queryParams;

  const searchConditions: SQL[] = [];
  const filterConditions: SQL[] = [];

  if (search) {
    searchableColumns.forEach((columnKey) => {
      const column = table[columnKey] as Column;
      searchConditions.push(ilike(column, `%${search}%`));
    });
  }

  filterableColumns.forEach((columnKey) => {
    const value = queryParams[columnKey as keyof typeof queryParams];
    if (value !== undefined && value !== null) {
      const column = table[columnKey] as Column;
      filterConditions.push(eq(column, value));
    }
  });

  if (!searchConditions.length && !filterConditions.length) {
    return undefined;
  }

  return and(
    filterConditions.length ? and(...filterConditions) : undefined,
    searchConditions.length ? or(...searchConditions) : undefined,
  );
};

export const buildCountQuery = async <
  TTable extends PgTable,
  TSearchable extends keyof TTable,
  TFilterable extends keyof TTable,
>({
  table,
  queryParams,
  searchableColumns,
  filterableColumns,
}: Omit<PaginationParams<TTable, TSearchable, TFilterable, never>, "sortableColumns">) => {
  const whereClause = buildGenericWhereClause({
    table,
    queryParams,
    searchableColumns,
    filterableColumns,
  });

  const result = await db
    .select({
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(table as PgTable)
    .where(whereClause);

  return result[0]?.count ?? 0;
};

export const buildPaginatedQuery = async <
  TTable extends PgTable,
  TSearchable extends keyof TTable,
  TFilterable extends keyof TTable,
  TSortable extends keyof TTable,
>({
  table,
  queryParams,
  searchableColumns,
  filterableColumns,
  sortableColumns,
}: PaginationParams<TTable, TSearchable, TFilterable, TSortable>) => {
  const { page, pageSize, sort } = queryParams;
  const offset = calculateOffset(page, pageSize);

  const whereClause = buildGenericWhereClause({
    table,
    queryParams,
    searchableColumns,
    filterableColumns,
  });

  const query = db
    .select()
    .from(table as PgTable)
    .where(whereClause)
    .limit(pageSize)
    .offset(offset);

  if (sort && sort.length > 0) {
    for (const { key: columnKey, direction } of sort) {
      if (sortableColumns.includes(columnKey as TSortable)) {
        const key = columnKey as keyof typeof table;
        const column = table[key] as Column;
        query.orderBy(direction === "asc" ? asc(column) : desc(column));
      }
    }
  }

  const rows = await query;

  return rows as InferSelectModel<TTable>[];
};
