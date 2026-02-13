import { TGetWaitlistQueryParams, TWaitlistForm } from "./waitlist.schema";
import {
  createWaitlistEntryRepository,
  getWaitlistEntriesCountRepository,
  getWaitlistEntriesWithPaginationRepository,
} from "./waitlist.repository";
import { TPaginationResponse } from "@/types/meta";
import { TWaitlistEntry } from "@/types/database";
import { paginationResponseMapper } from "@/lib/pagination";

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
