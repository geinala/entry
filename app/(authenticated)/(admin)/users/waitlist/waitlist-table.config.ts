"use client";

import { TSortOption } from "@/app/_components/data-table/sort";

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
