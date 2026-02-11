"use client";

import { convertUtcToLocalTime, toTitleCase } from "@/lib/utils";
import { WaitlistEntry } from "@/types/database";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { WaitlistStatusBadge } from "../_components/waitlist-status.badge";
import { Button } from "@/app/_components/ui/button";
import { toast } from "sonner";
import { Ellipsis } from "lucide-react";
import { SortOptionType } from "@/app/_components/data-table/sort";
import { useFilters } from "@/app/_hooks/use-filters";
import {
  GetWaitlistQueryParams,
  GetWaitlistQueryParamsType,
} from "@/server/waitlist/waitlist.schema";
import { FilterItemType } from "@/app/_components/data-table/filter-collections/factory";
import { waitlistStatusEnum } from "@/drizzle/schema";

export const useGetDataTableProperties = () => {
  const { filters } = useFilters(GetWaitlistQueryParams);
  const columns = useGetDataTableColumns();
  const sortOptions = useGetDataTableSortOptions();
  const filterOptions = useGetDataTableFilterOptions(filters.status);

  return { columns, sortOptions, filterOptions };
};

const useGetDataTableColumns = () => {
  return useMemo<ColumnDef<WaitlistEntry>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "createdAt",
        header: "Registered At",
        cell: ({ row }) => {
          const entry = row.original;
          return convertUtcToLocalTime({ utcDateStr: entry.createdAt.toString(), format: "PPpp" });
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const entry = row.original;
          return <WaitlistStatusBadge status={entry.status} />;
        },
      },
      {
        accessorKey: "actions",
        header: "",
        cell: () => {
          return (
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => {
                toast.info("Coming soon!");
              }}
            >
              <Ellipsis />
            </Button>
          );
        },
      },
    ],
    [],
  );
};

const useGetDataTableSortOptions = () => {
  return useMemo<SortOptionType[]>(
    () => [
      {
        key: "fullName",
        label: "Name",
        options: [
          { direction: "asc", label: "A-Z" },
          { direction: "desc", label: "Z-A" },
        ],
      },
      {
        key: "email",
        label: "Email",
        options: [
          { direction: "asc", label: "A-Z" },
          { direction: "desc", label: "Z-A" },
        ],
      },
    ],
    [],
  );
};

const useGetDataTableFilterOptions = (
  filters: GetWaitlistQueryParamsType["status"],
): FilterItemType[] => {
  return useMemo(
    (): FilterItemType[] => [
      {
        label: "Status",
        type: "Select",
        name: "status",
        options: [
          waitlistStatusEnum.enumValues.map((status) => ({
            label: toTitleCase(status),
            value: status,
          })),
        ].flat(),
        defaultValue: filters?.toString(),
        value: filters?.toString(),
      },
    ],
    [filters],
  );
};
