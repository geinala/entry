import { ReactNode } from "react";
import { Label } from "../../ui/label";
import { DateRangePickerProps } from "./date-range-picker";
import { SelectFilterProps } from "./select";
import { TimePickerProps } from "./time-picker";
import { IFilterTableProps } from "../filter";
import { FilterCollections, FilterRenderers } from ".";

type BaseFilterItem<P extends Record<string, unknown>> = P & {
  name: string;
  label: string;
};

type TypedFilterItem<
  P extends Record<string, unknown>,
  T extends keyof typeof FilterCollections,
> = BaseFilterItem<P> & {
  type: T;
};

export type FilterItemType =
  | TypedFilterItem<TimePickerProps, "TimePicker">
  | TypedFilterItem<SelectFilterProps, "Select">
  | TypedFilterItem<DateRangePickerProps, "DateRangePicker">;

type ComponentFilterProps<T extends FilterItemType> = {
  item: T;
  content: ReactNode;
};

const ComponentFilter = <T extends FilterItemType>({ item, content }: ComponentFilterProps<T>) => {
  return (
    <div className="mb-2 last:mb-0">
      <Label className="mb-1">{item.label}</Label>
      {content}
    </div>
  );
};

export const FilterInputFactory = (props: IFilterTableProps) => {
  const { filterItems, onChange } = props;

  return filterItems.map((filterItem) => {
    switch (filterItem.type) {
      case "TimePicker":
        return (
          <ComponentFilter
            key={filterItem.name}
            item={filterItem}
            content={FilterRenderers.TimePicker(filterItem, (value) =>
              onChange({ [filterItem.name]: value }),
            )}
          />
        );

      case "Select":
        return (
          <ComponentFilter
            key={filterItem.name}
            item={filterItem}
            content={FilterRenderers.Select(filterItem, (value) =>
              onChange({ [filterItem.name]: value }),
            )}
          />
        );

      case "DateRangePicker":
        return (
          <ComponentFilter
            key={filterItem.name}
            item={filterItem}
            content={FilterRenderers.DateRangePicker(filterItem, (value) =>
              onChange({ [filterItem.name]: value }),
            )}
          />
        );
    }
  });
};
