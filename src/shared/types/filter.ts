import type { JSX } from "react/jsx-runtime";

type Option = {
  label: string;
  value: string;
};

type BaseFilterComponent = {
  key: string; // Unique key for the filter
  label: string; // Label displayed for the filter
  name: string; // Name of the filter
  placeholder?: string; // Placeholder text for the input field
  defaultValue?: string | number | boolean | undefined; // Default value of the filter
  options?: Option[]; // Options for the select filter
};

type NumberFilterComponent = BaseFilterComponent & {
  type: "number";
};

type SelectFilterComponent = BaseFilterComponent & {
  type: "select";
  options: Option[];
};

type DatepickerFilterComponent = BaseFilterComponent & {
  type: "datepicker";
};

type DateRangeFilterComponent = BaseFilterComponent & {
  type: "daterange";
};

type MonthFilterComponent = BaseFilterComponent & {
  type: "month";
};

type YearFilterComponent = BaseFilterComponent & {
  type: "year";
};

type CustomFilterComponent = BaseFilterComponent & {
  type: "custom";
  render: () => JSX.Element;
};

export type TFilterItem =
  | NumberFilterComponent
  | SelectFilterComponent
  | DatepickerFilterComponent // Datepicker
  | DateRangeFilterComponent // Date range
  | MonthFilterComponent // Month
  | YearFilterComponent
  | CustomFilterComponent;
