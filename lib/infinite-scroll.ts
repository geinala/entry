import { TSimulation } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";

export const getNextPage = <T extends TPaginationResponse<TSimulation>>(lastPage: T) => {
  const { meta } = lastPage;

  if (!meta) return undefined;

  if (meta.page < meta.totalPage) {
    return { page: meta.page + 1, pageSize: meta.pageSize };
  }

  return undefined;
};
