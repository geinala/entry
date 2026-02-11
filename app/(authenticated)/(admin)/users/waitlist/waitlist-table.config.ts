"use client";

import { FilterItemType } from "@/app/_components/data-table/filter-collections/factory";
import { SortOptionType } from "@/app/_components/data-table/sort";
import { waitlistStatusEnum } from "@/drizzle/schema";
import { toTitleCase } from "@/lib/utils";
import { GetWaitlistQueryParamsType } from "@/server/waitlist/waitlist.schema";

export const getWaitlistSortingOptions = (): SortOptionType[] => {
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

export const getWaitlistFilteringOptions = (
  filters: GetWaitlistQueryParamsType,
): FilterItemType[] => {
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
      value: filters.status?.toString(),
    },
  ];
};
