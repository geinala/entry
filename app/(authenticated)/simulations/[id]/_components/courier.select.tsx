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
import { useGetAllActiveCouriersQuery } from "../_hooks/use-queries";

interface Props {
  totalActiveCouriers?: number;
}

export const CourierSelect = ({ totalActiveCouriers }: Props) => {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { data, isLoading } = useGetAllActiveCouriersQuery(id);

  const selectedCourierId = searchParams.get("courierId") ?? "all";

  const isDisabledSelect = isLoading || !Array.isArray(data?.data) || data.data.length === 0;

  const handleCourierChange = (courierId: string) => {
    updateQueryParam(searchParams, pathname, router, {
      courierId: courierId === "all" ? null : courierId,
      page: null,
    });
  };

  return (
    <div className="pt-3 px-3 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Title level={6}>Couriers</Title>
        <Paragraph className="text-sm text-muted-foreground">
          {totalActiveCouriers ?? 0} total
        </Paragraph>
      </div>
      <Paragraph className="text-sm text-muted-foreground">
        Select a courier to see detailed information. (default: all couriers)
      </Paragraph>
      <Select
        disabled={isDisabledSelect}
        value={selectedCourierId}
        onValueChange={handleCourierChange}
      >
        <SelectTrigger className="w-full" disabled={isDisabledSelect}>
          <SelectValue placeholder="Select a courier" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All couriers</SelectItem>
          {data?.data &&
            data.data.length > 0 &&
            data.data.map((courier) => (
              <SelectItem key={courier.id} value={courier.id.toString()}>
                {courier.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};
