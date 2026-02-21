import "server-only";

import { db } from "@/lib/db";
import { waitlistTable } from "@/drizzle/schema";
import { TNewWaitlistEntry } from "@/types/database";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { eq, inArray, sql } from "drizzle-orm";
import { toTitleCase } from "@/lib/utils";
import { TGetWaitlistQueryParams, TWaitlistForm } from "@/schemas/waitlist.schema";
import { TWaitlistEntrySummary } from "./waitlist.type";
import { generateSHA256Hash } from "@/lib/crypto";

export const createWaitlistEntryRepository = async (data: TWaitlistForm) => {
  const ticket = generateSHA256Hash(data.email);

  const waitlistEntry: TNewWaitlistEntry = {
    email: data.email.toLowerCase(),
    firstName: toTitleCase(data.firstName),
    lastName: toTitleCase(data.lastName),
    ticketId: ticket.slice(0, 16),
  };

  return db.insert(waitlistTable).values(waitlistEntry).returning();
};

export const getWaitlistEntryByTokenRepository = async (token: string) => {
  const result = await db
    .select()
    .from(waitlistTable)
    .where(eq(waitlistTable.ticketId, token))
    .limit(1);

  return result.length > 0 ? result[0] : null;
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

export const updateWaitlistEntryRepository = async (
  id: number | number[],
  data: Partial<TNewWaitlistEntry>,
) => {
  const payload: Partial<TNewWaitlistEntry> = {
    ...(data.status === "revoked" && { expiredAt: new Date() }),
    ...(data.status === "invited" && { invitedAt: new Date() }),
    ...(data.status === "pending" && { invitedAt: null, expiredAt: null }),
    ...(data.status === "confirmed" && { confirmedAt: new Date() }),
    ...(data.status === "denied" && { invitedAt: null, expiredAt: null, confirmedAt: null }),
  };

  if (Array.isArray(id)) {
    return await db
      .update(waitlistTable)
      .set({ ...data, ...payload })
      .where(inArray(waitlistTable.id, id));
  }

  return await db
    .update(waitlistTable)
    .set({ ...data, ...payload })
    .where(eq(waitlistTable.id, id));
};

export const getWaitlistEntryByEmailRepository = async (email: string) => {
  const result = await db
    .select()
    .from(waitlistTable)
    .where(eq(waitlistTable.email, email.toLowerCase()))
    .limit(1);

  return result.length > 0 ? result[0] : null;
};
