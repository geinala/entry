import { db } from "@/lib/db";
import { TGetWaitlistQueryParams, TWaitlistForm } from "./waitlist.schema";
import { waitlistTable } from "@/drizzle/schema";
import { TNewWaitlistEntry } from "@/types/database";
import { TWaitlistSortableKey } from "./waitlist.type";
import { buildCountQuery, buildPaginatedQuery } from "@/lib/query-builder";

export const createWaitlistEntryRepository = async (data: TWaitlistForm) => {
  const waitlistEntry: TNewWaitlistEntry = {
    email: data.email,
    fullName: data.name,
  };

  return db.insert(waitlistTable).values(waitlistEntry);
};

export const getWaitlistEntriesWithPaginationRepository = async (
  queryParams: TGetWaitlistQueryParams,
) => {
  return await buildPaginatedQuery({
    table: waitlistTable,
    filterableColumns: ["fullName", "email", "status"],
    searchableColumns: ["fullName", "email"],
    sortableColumns: ["fullName", "email"] as TWaitlistSortableKey[],
    queryParams,
  });
};

export const getWaitlistEntriesCountRepository = async (queryParams: TGetWaitlistQueryParams) => {
  return await buildCountQuery({
    table: waitlistTable,
    filterableColumns: ["fullName", "email", "status"],
    searchableColumns: ["fullName", "email"],
    queryParams,
  });
};
