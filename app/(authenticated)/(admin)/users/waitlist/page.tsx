"use client";

import DataTable from "@/app/_components/data-table";
import Page from "@/app/_components/page";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";
import { useGetWaitlistEntriesQuery } from "./_hooks/use-queries";
import { useFilters } from "@/app/_hooks/use-filters";
import { GetWaitlistQueryParams, TGetWaitlistQueryParams } from "@/schemas/waitlist.schema";
import { useWaitlistColumns } from "./_hooks/use-waitlist-columns";
import { getWaitlistFilteringOptions, getWaitlistSortingOptions } from "./waitlist-table.config";
import { Button } from "@/app/_components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

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

  const { columns, selectedIds, isSendingInvitations, sendBulkInvitations } = useWaitlistColumns();
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
      headerAction={
        <div className="flex gap-2">
          <Button
            variant={"secondary"}
            disabled={selectedIds.length === 0}
            onClick={sendBulkInvitations}
            isLoading={isSendingInvitations}
          >
            Send Invitations {selectedIds.length > 0 && `(${selectedIds.length})`}
          </Button>
          <Button size={"sm"} onClick={() => toast.warning("This feature is coming soon!")}>
            <Plus className="mr-2" />
            Invite Users
          </Button>
        </div>
      }
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
        /**
         * Enable row selection only when viewing pending entries
         * This prevents accidental bulk operations on confirmed/rejected entries
         */
        selectable={filters.status === "pending"}
      />
    </Page>
  );
}
