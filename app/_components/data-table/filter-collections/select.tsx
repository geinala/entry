import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { useState } from "react";

type SelectOptions = {
  value: string;
  label: string;
}[];

export type SelectFilterProps = Omit<React.ComponentProps<typeof Select>, "children"> & {
  options: SelectOptions;
  placeholder?: string;
  allowClear?: boolean;
};

export const SelectFilter = (props: SelectFilterProps) => {
  const { allowClear, ...selectProps } = props;
  const [value, setValue] = useState<string>("");

  const handleClear = () => {
    setValue("");
    if (selectProps.onValueChange) {
      selectProps.onValueChange("");
    }
  };

  return (
    <Select
      value={value}
      onValueChange={(val) => {
        setValue(val);
        if (selectProps.onValueChange) {
          selectProps.onValueChange(val);
        }
      }}
      {...selectProps}
    >
      <SelectTrigger isShowClearButton={allowClear && value !== ""} onClear={handleClear}>
        <SelectValue placeholder={props.placeholder || "Select an option"} />
      </SelectTrigger>
      <SelectContent position="popper">
        {props.options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
