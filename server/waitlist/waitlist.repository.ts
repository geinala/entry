import { db } from "@/lib/db";
import { GetWaitlistQueryParamsType, WaitlistFormType } from "./waitlist.schema";
import { waitlistTable } from "@/drizzle/schema";
import { NewWaitlistEntry } from "@/types/database";
import { buildFilterClause, buildSortingClause, FilterCriterion } from "@/lib/query";
import { WaitlistFilteredColumns, WaitlistSortableKey } from "./waitlist.type";
import { or, sql } from "drizzle-orm";
import { calculateOffset } from "@/lib/pagination";

export const createWaitlistEntryRepository = async (data: WaitlistFormType) => {
  const waitlistEntry: NewWaitlistEntry = {
    email: data.email,
    fullName: data.name,
  };

  return db.insert(waitlistTable).values(waitlistEntry);
};

export const getWaitlistEntriesWithPaginationRepository = async (
  queryParams: GetWaitlistQueryParamsType,
) => {
  const { page, pageSize, search, sort } = queryParams;

  const offset = calculateOffset(page, pageSize);

  const filters: FilterCriterion[] = [
    { key: "email", operator: "ilike", value: search },
    {
      key: "fullName",
      operator: "ilike",
      value: search,
    },
  ];

  const sortableColumns: Record<WaitlistSortableKey, (typeof waitlistTable)[WaitlistSortableKey]> =
    {
      fullName: waitlistTable.fullName,
      email: waitlistTable.email,
    };

  const filteredCoulmns: Record<
    WaitlistFilteredColumns,
    (typeof waitlistTable)[WaitlistFilteredColumns]
  > = {
    fullName: waitlistTable.fullName,
    email: waitlistTable.email,
  };

  const searchConditions = buildFilterClause({
    columns: filteredCoulmns,
    filters,
  });

  const sortClause = buildSortingClause({ columns: sortableColumns, sort });

  const query = db
    .select()
    .from(waitlistTable)
    .where(searchConditions.length ? or(...searchConditions) : undefined)
    .limit(pageSize)
    .offset(offset);

  if (sortClause && sortClause.length > 0) {
    query.orderBy(...sortClause);
  }

  const data = await query;

  return data;
};

export const getWaitlistEntriesCountRepository = async (
  queryParams: GetWaitlistQueryParamsType,
) => {
  const { search } = queryParams;
  const filteredColumns: Record<
    WaitlistFilteredColumns,
    (typeof waitlistTable)[WaitlistFilteredColumns]
  > = {
    fullName: waitlistTable.fullName,
    email: waitlistTable.email,
  };

  const filters: FilterCriterion[] = [
    { key: "email", operator: "ilike", value: search },
    {
      key: "fullName",
      operator: "ilike",
      value: search,
    },
  ];

  const searchConditions = buildFilterClause({
    columns: filteredColumns,
    filters,
  });

  const result = await db
    .select({
      count: sql<number>`count(id)`,
    })
    .from(waitlistTable)
    .where(searchConditions.length ? or(...searchConditions) : undefined);

  return result[0].count;
};
