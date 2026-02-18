import "server-only";

import {
  createWaitlistEntryRepository,
  getWaitlistEntriesCountRepository,
  getWaitlistEntriesWithPaginationRepository,
  updateWaitlistEntriesStatusRepository,
} from "./waitlist.repository";
import { TWaitlistEntry } from "@/types/database";
import { paginationResponseMapper } from "@/lib/pagination";
import { TPaginationResponse } from "@/types/meta";
import { TGetWaitlistQueryParams, TUpdateWaitlist, TWaitlistForm } from "@/schemas/waitlist.schema";

export const createWaitlistEntryService = async (data: TWaitlistForm) => {
  return await createWaitlistEntryRepository(data);
};

export const getWaitlistEntriesWithPaginationService = async (
  queryParams: TGetWaitlistQueryParams,
): Promise<TPaginationResponse<TWaitlistEntry>> => {
  try {
    const [entries, total] = await Promise.all([
      getWaitlistEntriesWithPaginationRepository(queryParams),
      getWaitlistEntriesCountRepository(queryParams),
    ]);

    return paginationResponseMapper<TWaitlistEntry>(entries, {
      currentPage: queryParams.page,
      pageSize: queryParams.pageSize,
      totalItems: total,
    });
  } catch (error) {
    throw error;
  }
};

export const updateWaitlistEntriesStatusService = async (payload: TUpdateWaitlist) => {
  try {
    await updateWaitlistEntriesStatusRepository(payload);
  } catch (error) {
    throw error;
  }
};
