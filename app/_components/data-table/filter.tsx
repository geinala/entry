"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ListFilter } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { FilterInputFactory, TFilterItem } from "./filter-collections/factory";
import { TFilterValue } from ".";
import { useMemo, useState } from "react";
import { Badge } from "../ui/badge";

export interface IFilterTableProps {
  filterItems: TFilterItem[];
  onChange: (value: Record<string, TFilterValue>) => void;
}

export const FilterTable = (props: IFilterTableProps) => {
  const [localFilterValues, setLocalFilterValues] = useState<Record<string, TFilterValue>>({});

  const handleInputChange = (value: Record<string, TFilterValue>) => {
    setLocalFilterValues((prev) => ({ ...prev, ...value }));
  };

  const getActiveFilterCount = useMemo(() => {
    return () => {
      return props.filterItems.reduce((count, item) => {
        const filterValue = item.defaultValue;
        if (filterValue !== undefined && filterValue !== null && filterValue !== "") {
          return count + 1;
        }
        return count;
      }, 0);
    };
  }, [props.filterItems]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ListFilter className="h-4 w-4" />
          Filter{" "}
          {getActiveFilterCount() > 0 && (
            <Badge className="ml-1" variant={"info"}>
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <Card className="p-2 border-none rounded-none gap-1 shadow-none">
          <CardContent className="p-0 bg-transparent">
            <FilterInputFactory
              {...props}
              onChange={handleInputChange}
              filterValues={localFilterValues}
            />
          </CardContent>
          <CardFooter className="flex justify-between items-center p-0 mt-2">
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => {
                props.onChange({});
                setLocalFilterValues({});
              }}
            >
              Reset
            </Button>
            <Button
              size={"sm"}
              onClick={() => {
                props.onChange(localFilterValues);
              }}
            >
              Apply
            </Button>
          </CardFooter>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
