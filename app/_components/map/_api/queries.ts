import { tomtomServer } from "@/lib/axios";
import { queryOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export interface ISearchResult {
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

interface TomTomSearchResult {
  poi?: { name: string };
  address?: { freeformAddress: string };
  position: { lat: number; lon: number };
}

interface TomTomSearchResponse {
  results: TomTomSearchResult[];
}

export const mapQueries = {
  fuzzySearch: (query: string) => {
    return queryOptions({
      queryKey: MAP_QUERY_KEYS.fuzzySearch(query),
      queryFn: async (): Promise<ISearchResult[]> => {
        const response: AxiosResponse<TomTomSearchResponse> = await tomtomServer.get(
          "/search/2/search/" + encodeURIComponent(query) + ".json",
          {
            params: {
              countrySet: "ID",
              typeahead: true,
            },
          },
        );

        return response.data.results.map((result) => ({
          name: result.poi?.name || result.address?.freeformAddress || "",
          lat: result.position.lat,
          lng: result.position.lon,
          address: result.address?.freeformAddress,
        }));
      },
      enabled: !!query.trim(),
    });
  },
  nearbySearch: ({ lat, lng }: { lat: number; lng: number }) => {
    return queryOptions({
      queryKey: MAP_QUERY_KEYS.nearbySearch({ lat, lng }),
      queryFn: async (): Promise<ISearchResult[]> => {
        const response: AxiosResponse<TomTomSearchResponse> = await tomtomServer.get(
          "/search/2/nearbySearch/.json",
          {
            params: {
              lat,
              lon: lng,
              radius: 100,
              limit: 1,
              countrySet: "ID",
            },
          },
        );

        return response.data.results.map((result) => ({
          name: result.poi?.name || result.address?.freeformAddress || "Unknown",
          lat: result.position.lat,
          lng: result.position.lon,
          address: result.address?.freeformAddress,
        }));
      },
      staleTime: 5 * 60 * 1000,
    });
  },
};

const MAP_QUERY_KEYS = {
  fuzzySearch: (query: string) => ["map", "fuzzySearch", query] as const,
  nearbySearch: ({ lat, lng }: { lat: number; lng: number }) =>
    ["map", "nearbySearch", lat, lng] as const,
};
