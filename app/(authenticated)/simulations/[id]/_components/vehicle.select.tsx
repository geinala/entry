"use client";

import { Paragraph, Title } from "@/app/_components/typography";
import { updateQueryParam } from "@/lib/query-param";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { usePathname, useParams, useRouter, useSearchParams } from "next/navigation";
import { useGetAllActiveVehiclesQuery } from "../_hooks/use-queries";

interface Props {
  totalActiveVehicles?: number;
}

export const VehicleSelect = ({ totalActiveVehicles }: Props) => {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { data, isLoading } = useGetAllActiveVehiclesQuery(id);

  const selectedVehicleId = searchParams.get("vehicleId") ?? "all";

  const isDisabledSelect = isLoading || !Array.isArray(data?.data) || data.data.length === 0;

  const handleVehicleChange = (vehicleId: string) => {
    updateQueryParam(searchParams, pathname, router, {
      vehicleId: vehicleId === "all" ? null : vehicleId,
      page: null,
    });
  };

  return (
    <div className="pt-3 px-3 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Title level={6}>Vehicles</Title>
        <Paragraph className="text-sm text-muted-foreground">
          {totalActiveVehicles ?? 0} total
        </Paragraph>
      </div>
      <Paragraph className="text-sm text-muted-foreground">
        Select a vehicle to see detailed information. (default: all vehicles)
      </Paragraph>
      <Select
        disabled={isDisabledSelect}
        value={selectedVehicleId}
        onValueChange={handleVehicleChange}
      >
        <SelectTrigger className="w-full" disabled={isDisabledSelect}>
          <SelectValue placeholder="Select a vehicle" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All vehicles</SelectItem>
          {data?.data &&
            data.data.length > 0 &&
            data.data.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                {vehicle.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};
