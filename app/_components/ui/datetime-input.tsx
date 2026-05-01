"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type DateTimeInputProps = Omit<React.ComponentProps<typeof Input>, "onChange"> & {
  value?: string | null;
  onChange?: (value: string) => void;
  dateFormat?: string;
};

function parseValue(value?: string | null) {
  if (!value) return { date: null as Date | null, time: "" };
  const d = new Date(value);
  if (isNaN(d.getTime())) return { date: null as Date | null, time: "" };
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return { date: d, time: `${hh}:${mm}` };
}

function composeISO(date: Date | null, time: string) {
  if (!date) return "";
  const [hh = "00", mm = "00"] = (time || "").split(":");
  const d = new Date(date);
  d.setHours(parseInt(hh || "0", 10), parseInt(mm || "0", 10), 0, 0);
  return d.toISOString();
}

const DateTimeInput = React.forwardRef<HTMLInputElement, DateTimeInputProps>(
  ({ className, value, onChange, dateFormat = "yyyy-MM-dd", ...props }, ref) => {
    const initial = React.useMemo(() => parseValue(value), [value]);
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(initial.date);
    const [timeValue, setTimeValue] = React.useState<string>(initial.time);

    React.useEffect(() => {
      const p = parseValue(value);
      setSelectedDate(p.date);
      setTimeValue(p.time);
    }, [value]);

    const handleDateSelect = (d: Date | undefined) => {
      const date = d ?? null;
      setSelectedDate(date);
      onChange?.(composeISO(date, timeValue));
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const tv = e.target.value;
      setTimeValue(tv);
      onChange?.(composeISO(selectedDate, tv));
    };

    const displayDate = selectedDate ? format(selectedDate, dateFormat) : "";

    return (
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Input
              ref={ref}
              readOnly
              value={displayDate}
              placeholder="Select date"
              className={cn(className, "w-full cursor-pointer text-left")}
              {...props}
            />
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <div className="p-3">
              <Calendar
                mode="single"
                selected={selectedDate ?? undefined}
                onSelect={handleDateSelect}
              />
            </div>
          </PopoverContent>
        </Popover>

        <Input
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
          className="w-full text-left"
          step={60}
          inputMode="numeric"
          pattern="[0-9]{2}:[0-9]{2}"
          placeholder="HH:MM (24h)"
        />
      </div>
    );
  },
);

DateTimeInput.displayName = "DateTimeInput";

export default DateTimeInput;
