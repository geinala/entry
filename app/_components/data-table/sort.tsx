"use client";

import { useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Card, CardContent, CardFooter } from "../ui/card";

export type SortDirection = "asc" | "desc";

export type SortOptionType = {
  label: string;
  key: string;
  options: Array<{
    label: string;
    direction: SortDirection;
  }>;
};

export type SortCriterion = {
  key: string;
  direction: SortDirection;
};

interface Props {
  sortOptions: SortOptionType[];
  defaultValue?: SortCriterion[];
  onSortChange?: (sorts: SortCriterion[]) => void;
}

export const SortButton = ({ sortOptions, defaultValue, onSortChange }: Props) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    transformSortCriterionToString(defaultValue),
  );

  const handleSelect = (key: string, direction: SortDirection) => {
    const newValue = `${key}:${direction}`;

    setSelectedValues((prev) => {
      if (prev.includes(newValue)) {
        return prev.filter((v) => v !== newValue);
      }

      const cleanPrev = prev.filter((item) => !item.startsWith(`${key}:`));

      return [...cleanPrev, newValue];
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ArrowDownUp className="h-4 w-4" />
          Sort
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-0">
        <Card className="p-1 border-none rounded-none gap-1">
          <CardContent className="p-0 bg-transparent">
            {sortOptions.map((sortOption) => (
              <DropdownMenuGroup key={sortOption.key}>
                <DropdownMenuLabel>{sortOption.label}</DropdownMenuLabel>

                {sortOption.options.map((option) => {
                  const itemValue = `${sortOption.key}:${option.direction}`;
                  const isChecked = selectedValues.includes(itemValue);

                  return (
                    <DropdownMenuCheckboxItem
                      key={`${sortOption.key}:${option.direction}`}
                      checked={isChecked}
                      onSelect={(e) => {
                        e.preventDefault();
                        handleSelect(sortOption.key, option.direction);
                      }}
                    >
                      {option.label}
                    </DropdownMenuCheckboxItem>
                  );
                })}

                <DropdownMenuSeparator />
              </DropdownMenuGroup>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between items-center p-0">
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => {
                onSortChange?.([]);
                setSelectedValues([]);
              }}
            >
              Reset
            </Button>
            <Button
              size={"sm"}
              onClick={() => {
                const sorts: SortCriterion[] = selectedValues.map((value) => {
                  const [key, direction] = value.split(":") as [string, SortDirection];
                  return { key, direction };
                });
                onSortChange?.(sorts);
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

const transformSortCriterionToString = (sorts: SortCriterion[] | undefined): string[] => {
  if (!sorts) return [];
  return sorts.map((sort) => `${sort.key}:${sort.direction}`);
};
