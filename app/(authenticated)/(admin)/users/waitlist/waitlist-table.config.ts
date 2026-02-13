"use client";

import { TFilterItem } from "@/app/_components/data-table/filter-collections/factory";
import { TSortOption } from "@/app/_components/data-table/sort";
import { waitlistStatusEnum } from "@/drizzle/schema";
import { toTitleCase } from "@/lib/utils";
import { TGetWaitlistQueryParams } from "@/server/waitlist/waitlist.schema";

export const getWaitlistSortingOptions = (): TSortOption[] => {
  return [
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
  ];
};

export const getWaitlistFilteringOptions = (filters: TGetWaitlistQueryParams): TFilterItem[] => {
  return [
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
      defaultValue: filters.status?.toString(),
      allowClear: true,
    },
  ];
};
