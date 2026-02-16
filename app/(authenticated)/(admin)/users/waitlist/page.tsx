"use client";

import DataTable from "@/app/_components/data-table";
import Page from "@/app/_components/page";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";
import { useGetWaitlistEntriesQuery } from "./_hooks/use-queries";
import { useFilters } from "@/app/_hooks/use-filters";
import { GetWaitlistQueryParams } from "@/schemas/waitlist.schema";
import { useWaitlistColumns } from "./_hooks/use-waitlist-columns";
import { getWaitlistFilteringOptions, getWaitlistSortingOptions } from "./waitlist-table.config";

export default function WaitlistPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(GetWaitlistQueryParams);

  const { data, isLoading } = useGetWaitlistEntriesQuery({
    ...pagination,
    search: filters.search,
    sort: filters.sort,
    status: filters.status,
  });

  const columns = useWaitlistColumns();
  const sortOptions = getWaitlistSortingOptions();
  const filterOptions = getWaitlistFilteringOptions(filters);

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Waitlist",
        href: "/users/waitlist",
      },
    ]);
  }, [setBreadcrumbs]);

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
        filterComponents={filterOptions}
      />
    </Page>
  );
}
