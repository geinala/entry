import { SortCriterion } from "@/app/_components/data-table/sort";
import { AnyColumn, SQL, asc, desc, eq, gt, gte, ilike, inArray, lt, lte, ne } from "drizzle-orm";

export function buildSortingClause({
  sort,
  columns,
}: {
  sort: Array<SortCriterion> | undefined;
  columns: Record<string, AnyColumn>;
}): SQL[] | undefined {
  if (!sort || sort.length === 0) return undefined;

  return sort.reduce<SQL[]>((acc, { key, direction }) => {
    const column = columns[key];

    if (!column) return acc;

    acc.push(direction === "asc" ? asc(column) : desc(column));
    return acc;
  }, []);
}

type FilterOperator = "eq" | "ne" | "lt" | "gt" | "lte" | "gte" | "in" | "ilike";

export type FilterCriterion = {
  key: string;
  operator: FilterOperator;
  value: string | number | boolean | (string | number)[] | undefined;
};

export function buildFilterClause({
  columns,
  filters,
}: {
  filters: Array<FilterCriterion> | undefined;
  columns: Record<string, AnyColumn>;
}): SQL[] {
  if (!filters || filters.length === 0) return [];
  if (filters.every((filter) => filter.value === undefined)) return [];

  return filters.reduce<SQL[]>((acc, { key, operator, value }) => {
    const column = columns[key];

    if (!column) return acc;

    switch (operator) {
      case "eq":
        if (!Array.isArray(value)) acc.push(eq(column, value));
        break;
      case "ne":
        if (!Array.isArray(value)) acc.push(ne(column, value));
        break;
      case "gt":
        if (!Array.isArray(value)) acc.push(gt(column, value));
        break;
      case "lt":
        if (!Array.isArray(value)) acc.push(lt(column, value));
        break;
      case "gte":
        if (!Array.isArray(value)) acc.push(gte(column, value));
        break;
      case "lte":
        if (!Array.isArray(value)) acc.push(lte(column, value));
        break;
      case "in":
        if (Array.isArray(value)) acc.push(inArray(column, value));
        break;
      case "ilike":
        if (!Array.isArray(value)) acc.push(ilike(column, `%${value}%`));
        break;
    }

    return acc;
  }, []);
}
