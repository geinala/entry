"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

interface Courier {
  id: number | string;
  name: string;
}

interface CourierSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  couriers?: Courier[];
  isLoading?: boolean;
  className?: string;
  isWithAllOption?: boolean;
}

export default function CourierSelect({
  value,
  isWithAllOption = true,
  onValueChange,
  couriers = [],
  isLoading = false,
  className = "w-56",
}: CourierSelectProps) {
  const isDisabled = isLoading || couriers.length === 0;

  return (
    <Select disabled={isDisabled} value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className} disabled={isDisabled}>
        <SelectValue placeholder="All couriers" />
      </SelectTrigger>

      <SelectContent position="popper">
        <SelectItem value="all" hidden={!isWithAllOption}>
          All couriers
        </SelectItem>

        {couriers.map((courier) => (
          <SelectItem key={courier.id} value={courier.id.toString()}>
            {courier.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
