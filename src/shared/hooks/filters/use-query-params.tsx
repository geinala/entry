import { useLocation, useRouter } from "@tanstack/react-router";
import { useCallback } from "react";

export function useQueryParams<
  TSearch extends Record<string, string | number | boolean | undefined>,
>() {
  const router = useRouter();
  const location = useLocation();

  const setParams = useCallback(
    (newParams: Partial<TSearch>, { replace = true }: { replace?: boolean } = {}) => {
      const search = Object.fromEntries(
        Object.entries(newParams).filter(([, v]) => v !== undefined && v !== ""),
      ) as TSearch;

      router.navigate({
        to: location.pathname,
        search,
        replace,
      });
    },
    [router, location.pathname],
  );

  return {
    pathname: location.pathname,
    search: location.search as TSearch,
    setParams,
  };
}
