import { debounce } from "@/lib/debounce";
import { updateQueryParam } from "@/lib/query-param";
import { getValidData } from "@/lib/validation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import z, { ZodSchema } from "zod";

export const useFilters = (schema: ZodSchema) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const validFilters = useMemo(() => {
    return getValidData(schema, Object.fromEntries(searchParams.entries()));
  }, [searchParams, schema]);

  const updateUrl = useCallback(
    (params: Record<string, z.infer<typeof schema>>) => {
      updateQueryParam(searchParams, pathname, router, params);
    },
    [searchParams, pathname, router],
  );

  const debouncedUpdateSearch = useMemo(
    () =>
      debounce((value: string) => {
        updateUrl({
          search: value || null,
          page: 1,
          pageSize: 10,
        });
      }, 500),
    [updateUrl],
  );

  const handleSearch = useCallback(
    (searchTerm: string) => {
      debouncedUpdateSearch(searchTerm);
    },
    [debouncedUpdateSearch],
  );

  const handlePaginationChange = useCallback(
    (page: number, pageSize: number) => {
      updateUrl({
        page: page > 0 ? page : null,
        pageSize: pageSize > 0 ? pageSize : null,
      });
    },
    [updateUrl],
  );

  const pagination = useMemo(
    () => ({
      page: typeof validFilters.page === "number" && validFilters.page > 0 ? validFilters.page : 1,
      pageSize:
        typeof validFilters.pageSize === "number" && validFilters.pageSize > 0
          ? validFilters.pageSize
          : 10,
    }),
    [validFilters.page, validFilters.pageSize],
  );

  const handlers = useMemo(
    () => ({
      onFilterChange: () => {
        // TODO: Implement filter change handler
      },
      onSortingChange: () => {
        // TODO: Implement sorting change handler
      },
      onPaginationChange: handlePaginationChange,
      onSearch: handleSearch,
    }),
    [handlePaginationChange, handleSearch],
  );

  return {
    search: typeof validFilters.search === "string" ? validFilters.search : "",
    handleChange: handlers,
    pagination,
    filters: validFilters,
  };
};
