import { debounce } from "@/lib/debounce";
import { updateQueryParam } from "@/lib/query-param";
import { parseQueryParams } from "@/lib/validation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import z, { ZodSchema } from "zod";
import { SortCriterion } from "../_components/data-table/sort";

export const useFilters = (schema: ZodSchema) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const validFilters = useMemo(() => {
    const result = parseQueryParams(schema, Object.fromEntries(searchParams.entries()));
    return result.success ? result.data : {};
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

  const handleSortingChange = useCallback(
    (sorts: SortCriterion[]) => {
      const sortValue = sorts.map((s) => `${s.key}:${s.direction}`).join(",");

      updateUrl({
        sort: sortValue || null,
        page: 1,
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
      onSortingChange: handleSortingChange,
      onPaginationChange: handlePaginationChange,
      onSearch: handleSearch,
    }),
    [handlePaginationChange, handleSearch, handleSortingChange],
  );

  return {
    search: typeof validFilters.search === "string" ? validFilters.search : "",
    handleChange: handlers,
    pagination,
    filters: validFilters,
  };
};
