import "server-only";

import { db } from "@/lib/db";
import { waitlistTable } from "@/drizzle/schema";
import { TNewWaitlistEntry } from "@/types/database";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { inArray, sql } from "drizzle-orm";
import { toTitleCase } from "@/lib/utils";
import { TGetWaitlistQueryParams, TUpdateWaitlist, TWaitlistForm } from "@/schemas/waitlist.schema";
import { TWaitlistEntrySummary } from "./waitlist.type";

export const createWaitlistEntryRepository = async (data: TWaitlistForm) => {
  const waitlistEntry: TNewWaitlistEntry = {
    email: data.email,
    firstName: toTitleCase(data.firstName),
    lastName: toTitleCase(data.lastName),
    expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
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

export const updateWaitlistEntriesStatusRepository = async (payload: TUpdateWaitlist) => {
  const { waitlistIds, status } = payload;

  return await db.transaction(async (tx) => {
    return await tx
      .update(waitlistTable)
      .set({ status })
      .where(inArray(waitlistTable.id, waitlistIds));
  });
};

export const getWaitlistEntriesSummaryRepository = async (): Promise<TWaitlistEntrySummary> => {
  const result = await db
    .select({
      status: waitlistTable.status,
      count: sql`count(*)`,
    })
    .from(waitlistTable)
    .groupBy(waitlistTable.status);

  const summary: TWaitlistEntrySummary = {
    pending: 0,
    confirmed: 0,
    denied: 0,
    expired: 0,
    failed: 0,
    invited: 0,
    revoked: 0,
  };

  for (const item of result) {
    switch (item.status) {
      case "confirmed":
        summary.confirmed = Number(item.count);
        break;
      case "pending":
        summary.pending = Number(item.count);
        break;
      case "denied":
        summary.denied = Number(item.count);
        break;
      case "expired":
        summary.expired = Number(item.count);
        break;
      case "invited":
        summary.invited = Number(item.count);
        break;
      case "revoked":
        summary.revoked = Number(item.count);
        break;
      case "failed":
        summary.failed = Number(item.count);
        break;
    }
  }

  return summary;
};
