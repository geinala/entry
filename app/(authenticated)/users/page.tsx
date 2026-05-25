"use client";

import DataTable from "@/app/_components/data-table";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { TUser } from "@/types/database";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useGetUsers } from "./_hooks/use-get-users";
import { useFilters } from "@/app/_hooks/use-filters";
import Page from "@/app/_components/page";
import { UserIndexQueryParams } from "@/schemas/user.schema";

export default function UsersPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(UserIndexQueryParams);

  const { data, isLoading } = useGetUsers({
    ...pagination,
    search: filters.search,
    sort: filters.sort,
  });

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Users",
        href: "/users",
      },
    ]);
  }, [setBreadcrumbs]);

  const columns = useMemo<ColumnDef<TUser>[]>(
    () => [
      {
        accessorKey: "profile",
        header: "Profile",
        cell: ({ row }) => {
          const user = row.original;
          const { fullName } = user;
          return (
            <div className="flex items-center gap-2">
              <Image
                src={`https://placehold.co/32x32/f54a00/FFF.png?text=${fullName?.charAt(0) || "U"}`}
                alt={fullName || "Unnamed User"}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <span>{fullName || "Unnamed User"}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
      },
    ],
    [],
  );

  return (
    <Page
      title="Users Management"
      description="View and manage all registered users in the system. Use the search and sorting features to quickly find specific users."
      isLoading={isLoading}
    >
      <DataTable
        columns={columns}
        isLoading={isLoading}
        search={search}
        source={data}
        handleChange={handleChange}
        isSearchable
        pagination={pagination}
      />
    </Page>
  );
}
