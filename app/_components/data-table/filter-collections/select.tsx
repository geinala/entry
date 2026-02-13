"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

type SelectOptions = {
  value: string;
  label: string;
}[];

export type SelectFilterProps = Omit<
  React.ComponentProps<typeof Select>,
  "children" | "onValueChange"
> & {
  options: SelectOptions;
  placeholder?: string;
  allowClear?: boolean;
  onChange?: (value: string) => void;
  value?: string;
};

export const SelectFilter = ({
  allowClear,
  placeholder,
  options,
  onChange,
  value = "",
  ...selectProps
}: SelectFilterProps) => {
  const handleClear = () => {
    onChange?.("");
  };

  const handleValueChange = (newValue: string) => {
    onChange?.(newValue);
  };

  return (
    <Select onValueChange={handleValueChange} value={value} {...selectProps}>
      <SelectTrigger
        isShowClearButton={allowClear && value !== ""}
        onClear={handleClear}
        className="w-full"
      >
        <SelectValue placeholder={placeholder || "Select an option"} />
      </SelectTrigger>
      <SelectContent position="popper">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
