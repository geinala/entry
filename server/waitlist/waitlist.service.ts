import { GetWaitlistQueryParamsType, WaitlistFormType } from "./waitlist.schema";
import {
  createWaitlistEntryRepository,
  getWaitlistEntriesCountRepository,
  getWaitlistEntriesWithPaginationRepository,
} from "./waitlist.repository";
import { TPaginationResponse } from "@/types/meta";
import { WaitlistEntry } from "@/types/database";
import { paginationResponseMapper } from "@/lib/pagination";

export const createWaitlistEntryService = async (data: WaitlistFormType) => {
  return await createWaitlistEntryRepository(data);
};

export const getWaitlistEntriesWithPaginationService = async (
  queryParams: GetWaitlistQueryParamsType,
): Promise<TPaginationResponse<WaitlistEntry>> => {
  try {
    const [entries, total] = await Promise.all([
      getWaitlistEntriesWithPaginationRepository(queryParams),
      getWaitlistEntriesCountRepository(queryParams),
    ]);

    return paginationResponseMapper<WaitlistEntry>(entries, {
      currentPage: queryParams.page,
      pageSize: queryParams.pageSize,
      totalItems: total,
    });
  } catch (error) {
    throw error;
  }
};
