import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";

export const updateQueryParam = (
  searchParams: ReadonlyURLSearchParams,
  pathname: string,
  router: AppRouterInstance,
  newParams: Record<string, string | number | null>,
) => {
  const params = new URLSearchParams(searchParams.toString());

  Object.entries(newParams).forEach(([key, value]) => {
    if (value === null || value === "") {
      /* eslint-disable drizzle/enforce-delete-with-where */
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  router.push(`${pathname}?${params.toString()}`);
};
