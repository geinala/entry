"use client";

import { debounce } from "@/lib/debounce";
import { updateQueryParam } from "@/lib/query-param";
import { parseQueryParams } from "@/lib/validation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import z, { ZodSchema } from "zod";
import { SortCriterion } from "../_components/data-table/sort";
import { FilterValue } from "../_components/data-table";

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

  const handleFilterChange = useCallback(
    (filters: Record<string, FilterValue>) => {
      const updatedFilters: Record<string, z.infer<typeof schema>> = { page: 1 };

      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          updatedFilters[key] = null;
        } else {
          updatedFilters[key] = value as z.infer<typeof schema>;
        }
      });

      updateUrl(updatedFilters);
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
      onFilterChange: handleFilterChange,
      onSortingChange: handleSortingChange,
      onPaginationChange: handlePaginationChange,
      onSearch: handleSearch,
    }),
    [handlePaginationChange, handleSearch, handleSortingChange, handleFilterChange],
  );

  return {
    search: typeof validFilters.search === "string" ? validFilters.search : "",
    handleChange: handlers,
    pagination,
    filters: validFilters,
  };
};
