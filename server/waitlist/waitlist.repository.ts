import "server-only";

import { db } from "@/lib/db";
import { waitlistTable } from "@/drizzle/schema";
import { TNewWaitlistEntry } from "@/types/database";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { sql } from "drizzle-orm";
import { toTitleCase } from "@/lib/utils";
import { TGetWaitlistQueryParams, TWaitlistForm } from "@/schemas/waitlist.schema";

export const createWaitlistEntryRepository = async (data: TWaitlistForm) => {
  const waitlistEntry: TNewWaitlistEntry = {
    email: data.email,
    firstName: toTitleCase(data.firstName),
    lastName: toTitleCase(data.lastName),
    expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // Set expiration to 30 days from now
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
