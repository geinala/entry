import { FilterIcon } from "lucide-react";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Label } from "../label";
import { FilterItem } from "./filter-item";
import type { TFilterItem } from "@/shared/types/filter";
import { type FC } from "react";

interface FilterPanelProps {
  filterItems?: TFilterItem[];
  onFilterChange: (e: React.FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  children?: React.ReactNode;
}

export const FilterPanel: FC<FilterPanelProps> = ({
  filterItems,
  onFilterChange,
  onReset,
  children,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          Filters
          <FilterIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <form onSubmit={onFilterChange}>
          <div className="flex flex-col gap-3">
            {filterItems &&
              filterItems.map((filter) => (
                <div key={filter.key}>
                  <Label htmlFor={filter.key}>{filter.label}</Label>
                  <FilterItem
                    onFilterChange={() => {}} // Placeholder, logika di parent
                    filter={filter}
                  />
                </div>
              ))}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onReset}>
                Clear
              </Button>
              <Button type="submit">Apply</Button>
            </div>
          </div>
          {children}
        </form>
      </PopoverContent>
    </Popover>
  );
};
