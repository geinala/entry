import { type FC } from "react";
import type { DateRange } from "react-day-picker";
import { NumericInput } from "../input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import type { TFilterItem } from "@/shared/types/filter";

interface Props {
  filter: TFilterItem;
  onFilterChange: (newFilters: Record<string, string | number | undefined>) => void;
}

export const FilterItem: FC<Props> = ({ filter, onFilterChange }) => {
  const handleValueChange = (value: string | number | Date | DateRange | undefined) => {
    let newValue: string | number | undefined;

    if (value instanceof Date) {
      newValue = value.getTime();
    } else if (value && typeof value === "object" && "from" in value && "to" in value) {
      const fromTimestamp = value.from?.getTime();
      const toTimestamp = value.to?.getTime();
      newValue = `${fromTimestamp},${toTimestamp}`;
    } else {
      newValue = value as string | number | undefined;
    }

    onFilterChange({ [filter.key]: newValue });
  };

  switch (filter.type) {
    case "number":
      return (
        <NumericInput
          placeholder={filter.placeholder}
          name={filter.name}
          id={filter.key}
          value={filter.defaultValue?.toString() || ""}
          autoFocus={false}
          maxLength={Number.MAX_SAFE_INTEGER.toString().length}
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
            handleValueChange(Number(e.currentTarget.value));
          }}
        />
      );
    case "select":
      return (
        <Select
          onValueChange={(value) => handleValueChange(value)}
          defaultValue={filter.defaultValue?.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    default:
      return filter.type === "custom" && filter.render();
  }
};
