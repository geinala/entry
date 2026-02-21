"use client";

import DataTable from "@/app/_components/data-table";
import Page from "@/app/_components/page";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";
import { useGetWaitlistEntriesQuery } from "./_hooks/use-queries";
import { useFilters } from "@/app/_hooks/use-filters";
import { GetWaitlistQueryParams, TGetWaitlistQueryParams } from "@/schemas/waitlist.schema";
import { useWaitlistColumns } from "./_hooks/use-waitlist-columns";
import { getWaitlistSortingOptions } from "./waitlist-table.config";
import { Button } from "@/app/_components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import { waitlistStatusEnum } from "@/drizzle/schema";
import { toTitleCase } from "@/lib/utils";

export default function WaitlistPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(GetWaitlistQueryParams);

  const params: TGetWaitlistQueryParams = {
    ...pagination,
    search: filters.search,
    sort: filters.sort,
    status: filters.status,
  };

  /**
   * Fetch waitlist entries based on current filter/sort/pagination params
   */
  const { data, isLoading } = useGetWaitlistEntriesQuery({
    ...params,
  });

  const { columns, clearSelection } = useWaitlistColumns(data?.data);
  const sortOptions = getWaitlistSortingOptions();
  const isSelectable =
    filters.status === "pending" ||
    filters.status === "denied" ||
    filters.status === "expired" ||
    filters.status === "invited" ||
    filters.status === "revoked" ||
    filters.status === "failed";

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
      headerAction={
        <Button
          size={"sm"}
          onClick={() => toast.warning("This feature is coming soon!")}
          className="shadow-orange-700"
        >
          <Plus className="mr-2" />
          Invite User
        </Button>
      }
    >
      <Tabs
        onValueChange={async (value) => {
          handleChange.onFilterChange({ status: value });
          clearSelection();
        }}
        defaultValue={filters.status}
      >
        <TabsList>
          {waitlistStatusEnum.enumValues.map((status) => {
            if (status === "sending") return null;

            return (
              <TabsTrigger key={status} value={status}>
                {toTitleCase(status) + (data?.summary ? ` (${data.summary[status] || 0})` : " (0)")}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
      <DataTable
        columns={columns}
        source={data}
        handleChange={{
          onPaginationChange: handleChange.onPaginationChange,
          onSearch: handleChange.onSearch,
          onSortingChange: handleChange.onSortingChange,
          onFilterChange: () => {},
        }}
        search={search}
        isLoading={isLoading}
        pagination={pagination}
        isSearchable
        sortOptions={sortOptions}
        sortDefaultValue={filters.sort}
        placeholderSearch="Search with name or email ..."
        selectable={isSelectable}
      />
    </Page>
  );
}
