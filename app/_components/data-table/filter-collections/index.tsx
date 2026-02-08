import { JSX } from "react";
import { DateRangePicker } from "./date-range-picker";
import { FilterItemType } from "./factory";
import { SelectFilter } from "./select";
import TimePicker from "./time-picker";
import { DateRange } from "react-day-picker";

const FilterCollections = {
  TimePicker: (item: Extract<FilterItemType, { type: "TimePicker" }>) => <TimePicker {...item} />,
  Select: (item: Extract<FilterItemType, { type: "Select" }>) => <SelectFilter {...item} />,
  DateRangePicker: (item: Extract<FilterItemType, { type: "DateRangePicker" }>) => (
    <DateRangePicker {...item} />
  ),
};

type FilterItemMap = {
  TimePicker: Extract<FilterItemType, { type: "TimePicker" }>;
  Select: Extract<FilterItemType, { type: "Select" }>;
  DateRangePicker: Extract<FilterItemType, { type: "DateRangePicker" }>;
};

const FilterRenderers = {
  TimePicker: (item: FilterItemMap["TimePicker"], onChange: (value: string) => void) => (
    <FilterCollections.TimePicker {...item} onChange={onChange} />
  ),

  Select: (item: FilterItemMap["Select"], onChange: (value: string) => void) => (
    <FilterCollections.Select {...item} onValueChange={onChange} />
  ),

  DateRangePicker: (
    item: FilterItemMap["DateRangePicker"],
    onChange: (value: string | DateRange | undefined) => void,
  ) => <FilterCollections.DateRangePicker {...item} onChange={onChange} />,
} satisfies {
  [K in keyof FilterItemMap]: (
    item: FilterItemMap[K],
    onChange: (value: string | DateRange | undefined) => void,
  ) => JSX.Element;
};

export { FilterRenderers, FilterCollections };
