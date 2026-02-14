import { db } from "@/lib/db";
import { TGetWaitlistQueryParams, TWaitlistForm } from "./waitlist.schema";
import { waitlistTable } from "@/drizzle/schema";
import { TNewWaitlistEntry } from "@/types/database";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { sql } from "drizzle-orm";

export const createWaitlistEntryRepository = async (data: TWaitlistForm) => {
  const waitlistEntry: TNewWaitlistEntry = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
  };

  return db.insert(waitlistTable).values(waitlistEntry);
};

const WAITLIST_COLUMNS: TColumnsDefinition<typeof waitlistTable> = {
  email: { searchable: true, sortable: true },
  status: { filterable: true },
  fullName: {
    searchable: true,
    sortable: true,
    compute: (table) => sql`concat(${table.firstName}, ' ', ${table.lastName})`,
  },
};

export const getWaitlistEntriesWithPaginationRepository = async (
  queryParams: TGetWaitlistQueryParams,
) => {
  return await buildPaginatedQuery({
    table: waitlistTable,
    columns: WAITLIST_COLUMNS,
    queryParams,
  });
};

export const getWaitlistEntriesCountRepository = async (queryParams: TGetWaitlistQueryParams) => {
  return await buildCountQuery({
    table: waitlistTable,
    columns: WAITLIST_COLUMNS,
    queryParams,
  });
};
