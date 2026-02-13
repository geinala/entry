import { db } from "@/lib/db";
import { GetWaitlistQueryParamsType, WaitlistFormType } from "./waitlist.schema";
import { waitlistTable } from "@/drizzle/schema";
import { NewWaitlistEntry } from "@/types/database";
import { WaitlistSortableKey } from "./waitlist.type";
import { buildCountQuery, buildPaginatedQuery } from "@/lib/query-builder";

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
  return await buildPaginatedQuery({
    table: waitlistTable,
    filterableColumns: ["fullName", "email", "status"],
    searchableColumns: ["fullName", "email"],
    sortableColumns: ["fullName", "email"] as WaitlistSortableKey[],
    queryParams,
  });
};

export const getWaitlistEntriesCountRepository = async (
  queryParams: GetWaitlistQueryParamsType,
) => {
  return await buildCountQuery({
    table: waitlistTable,
    filterableColumns: ["fullName", "email", "status"],
    searchableColumns: ["fullName", "email"],
    queryParams,
  });
};
