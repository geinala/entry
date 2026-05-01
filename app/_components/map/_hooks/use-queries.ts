import { useQuery } from "@tanstack/react-query";
import { mapQueries } from "../_api/queries";

export const useFuzzySearchLocationQuery = (query: string) => {
  return useQuery(mapQueries.fuzzySearch(query));
};
