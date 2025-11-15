import { useCallback, useState } from "react";

export function useFilters<TFilters extends Record<string, string | number | boolean | undefined>>(
  initial?: TFilters,
) {
  const [filters, setFilters] = useState<Partial<TFilters>>(initial ?? {});

  const updateFilters = useCallback((newFilters: Partial<TFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return { filters, updateFilters };
}
