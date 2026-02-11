"use client";

import DataTable from "@/app/_components/data-table";
import Page from "@/app/_components/page";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { WaitlistEntry } from "@/types/database";
import { useEffect, useMemo } from "react";
import { useGetWaitlistEntriesQuery } from "./_hooks/use-queries";
import { ColumnDef } from "@tanstack/react-table";
import { useFilters } from "@/app/_hooks/use-filters";
import { GetWaitlistQueryParams } from "@/server/waitlist/waitlist.schema";
import { WaitlistStatusBadge } from "./_components/waitlist-status.badge";
import { Button } from "@/app/_components/ui/button";
import { Ellipsis } from "lucide-react";
import { convertUtcToLocalTime } from "@/lib/utils";
import { SortOptionType } from "@/app/_components/data-table/sort";
import { toast } from "sonner";

export default function WaitlistPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(GetWaitlistQueryParams);
  const { data, isLoading } = useGetWaitlistEntriesQuery({
    ...pagination,
    search: filters.search,
    sort: filters.sort,
  });

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Waitlist",
        href: "/users/waitlist",
      },
    ]);
  }, [setBreadcrumbs]);

  const columns = useMemo<ColumnDef<WaitlistEntry>[]>(
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

  const sortOptions = useMemo<SortOptionType[]>(
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

  return (
    <Page
      title="Waitlist Management"
      description="Manage registered users, review their status, and send invitations directly from this page."
    >
      <DataTable
        columns={columns}
        source={data}
        handleChange={handleChange}
        search={search}
        isLoading={isLoading}
        pagination={pagination}
        isSearchable
        sortOptions={sortOptions}
        sortDefaultValue={filters.sort}
        placeholderSearch="Search with name or email ..."
      />
    </Page>
  );
}
