"use client";

import DataTable from "@/app/_components/data-table";
import Page from "@/app/_components/page";
import { useGetRolesWithPaginationQuery } from "./_hooks/use-queries";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexRoleQueryParams } from "@/schemas/role.schema";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TRole } from "@/types/database";
import { toTitleCase } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Button } from "@/app/_components/ui/button";
import { Ellipsis, Plus, ReceiptText, Settings, Trash } from "lucide-react";
import { toast } from "sonner";
import { TSortOption } from "@/app/_components/data-table/sort";

const ListRolePage = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(IndexRoleQueryParams);

  const { data, isLoading } = useGetRolesWithPaginationQuery({
    ...pagination,
    search: filters.search,
    sort: filters.sort,
  });

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Roles",
      },
    ]);
  }, [setBreadcrumbs]);

  const columns: ColumnDef<TRole>[] = [
    {
      accessorKey: "name",
      header: "Role Name",
      cell: ({ row }) => {
        const role = row.original;
        return toTitleCase(role.name);
      },
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: () => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon-sm"}>
                <Ellipsis className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => toast.warning("This feature is not yet implemented")}
              >
                <Settings className="text-neutral-700" />
                Edit Role
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.warning("This feature is not yet implemented")}
              >
                <ReceiptText className="text-neutral-700" />
                View Role Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => toast.warning("This feature is not yet implemented")}
              >
                <Trash />
                Delete Role
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const sortOptions: TSortOption[] = [
    {
      key: "name",
      label: "Role Name",
      options: [
        { direction: "asc", label: "A-Z" },
        { direction: "desc", label: "Z-A" },
      ],
    },
  ];

  return (
    <Page
      title="Roles Management"
      description="Manage user roles and permissions"
      headerAction={
        <Button onClick={() => toast.warning("This feature is not yet implemented")}>
          <Plus />
          Create New Role
        </Button>
      }
    >
      <DataTable
        columns={columns}
        source={data}
        handleChange={handleChange}
        search={search}
        isLoading={isLoading}
        pagination={pagination}
        sortOptions={sortOptions}
        isSearchable
        sortDefaultValue={filters.sort}
        placeholderSearch="Search with name ..."
      />
    </Page>
  );
};

export default ListRolePage;
