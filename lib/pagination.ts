import { TPaginationMeta, TPaginationResponse } from "@/types/meta";

interface Params {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export const convertPaginationMeta = ({
  currentPage,
  pageSize,
  totalItems,
}: Params): TPaginationMeta => ({
  page: currentPage,
  pageSize,
  total: totalItems,
  totalPage: Math.ceil(totalItems / pageSize),
});

export const paginationResponseMapper = <T>(data: T[], meta: Params): TPaginationResponse<T[]> => ({
  data,
  meta: Object.freeze(convertPaginationMeta(meta)),
});
