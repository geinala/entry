"use client";

import { useState } from "react";
import { useMap } from "./context";
import { Input } from "../ui/input";
import Loading from "../loading";
import { useDebounce } from "@/app/_hooks/use-debounce";
import { ISearchResult } from "./_api/queries";
import { useFuzzySearchLocationQuery } from "./_hooks/use-queries";

interface MapSearchProps {
  onSelect?: (result: ISearchResult) => void;
  placeholder?: string;
  containerClassName?: string;
  inputClassName?: string;
}

export const MapSearch = ({
  onSelect,
  placeholder = "Search location...",
  containerClassName = "w-full",
  inputClassName = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background",
}: MapSearchProps) => {
  const { map, marker } = useMap();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const debouncedSearch = useDebounce((value: string) => {
    setDebouncedQuery(value.trim());
  }, 500);
  const normalizedQuery = query.trim();
  const shouldSearch = !!map && normalizedQuery.length >= 3;

  const { data: results = [], isFetching } = useFuzzySearchLocationQuery(
    shouldSearch ? debouncedQuery : "",
  );

  const handleInput = (value: string) => {
    const trimmedValue = value.trim();

    setQuery(value);
    setShowResults(trimmedValue.length >= 3);

    if (!map || trimmedValue.length < 3) {
      setDebouncedQuery("");
      return;
    }

    debouncedSearch(value);
  };

  const handleSelect = (result: ISearchResult) => {
    if (map) {
      map.mapLibreMap.flyTo({
        center: [result.lng, result.lat],
        zoom: 16,
        duration: 1000,
      });
      marker?.setLngLat([result.lng, result.lat]);
    }

    onSelect?.(result);
    setQuery("");
    setDebouncedQuery("");
    setShowResults(false);
  };

  return (
    <div className={containerClassName}>
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => setShowResults(query.trim().length >= 3)}
          placeholder={placeholder}
          className={`${inputClassName} pr-10`}
          size={"sm"}
        />

        {showResults && results.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {results.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(result)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0"
              >
                <div className="font-medium text-sm">{result.name}</div>
                {result.address && <div className="text-xs text-gray-500">{result.address}</div>}
              </button>
            ))}
          </div>
        )}

        {isFetching && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <Loading isFullscreen={false} />
          </div>
        )}
      </div>
    </div>
  );
};
