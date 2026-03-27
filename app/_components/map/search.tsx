"use client";

import { useState, useCallback } from "react";
import env from "@/common/config/environtment";
import { useMap } from "./context";
import { Input } from "../ui/input";
import Loading from "../loading";
import axios from "axios";
import { useDebounce } from "@/app/_hooks/use-debounce";

interface SearchResult {
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

interface MapSearchProps {
  onSelect?: (result: SearchResult) => void;
  placeholder?: string;
  containerClassName?: string;
  inputClassName?: string;
}

interface TomTomSearchResult {
  poi?: { name: string };
  address?: { freeformAddress: string };
  position: { lat: number; lon: number };
}

interface TomTomSearchResponse {
  results: TomTomSearchResult[];
}

export const MapSearch = ({
  onSelect,
  placeholder = "Search location...",
  containerClassName = "w-full",
  inputClassName = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background",
}: MapSearchProps) => {
  const { map } = useMap();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchLocation = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim() || !map) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get<TomTomSearchResponse>(
          `https://api.tomtom.com/search/2/search/${encodeURIComponent(searchQuery)}.json?key=${env.NEXT_PUBLIC_TOMTOM_API_KEY}&limit=10&countrySet=ID&typeahead=true`,
        );
        const data = response.data;

        const searchResults = (data.results || []).map((result) => ({
          name: result.poi?.name || result.address?.freeformAddress || "",
          lat: result.position.lat,
          lng: result.position.lon,
          address: result.address?.freeformAddress,
        }));

        setResults(searchResults);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [map],
  );

  const debouncedSearch = useDebounce(searchLocation, 300);

  const handleInput = (value: string) => {
    setQuery(value);
    setShowResults(true);
    debouncedSearch(value);
  };

  const handleSelect = (result: SearchResult) => {
    if (map) {
      map.mapLibreMap.flyTo({
        center: [result.lng, result.lat],
        zoom: 16,
        duration: 1000,
      });
    }

    onSelect?.(result);
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className={containerClassName}>
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className={inputClassName}
          size={"sm"}
        />

        {showResults && results.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {results.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSelect(result)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0"
              >
                <div className="font-medium text-sm">{result.name}</div>
                {result.address && <div className="text-xs text-gray-500">{result.address}</div>}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="absolute right-3 top-2.5">
            <Loading isFullscreen={false} />
          </div>
        )}
      </div>
    </div>
  );
};
