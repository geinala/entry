"use client";

import DataTable from "@/app/_components/data-table";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { User } from "@/types/database";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useGetUsers } from "./_hooks/use-get-users";
import { useFilters } from "@/app/_hooks/use-filters";
import Page from "@/app/_components/page";
import { SortOptionType } from "@/app/_components/data-table/sort";
import { GetUsersQueryParams } from "@/server/user/user.schema";

export default function UsersPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(GetUsersQueryParams);

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

  const columns = useMemo<ColumnDef<User>[]>(
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
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const roleId = row.original.roleId;
          let roleName = "User";
          if (roleId === 1) roleName = "Admin";
          else if (roleId === 2) roleName = "Moderator";
          return <span>{roleName}</span>;
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
    <Page title="Users" description="This page for managing users.">
      <DataTable<User, unknown>
        columns={columns}
        isLoading={isLoading}
        search={search}
        source={{
          data: data?.data || [],
          meta: data?.meta,
        }}
        handleChange={handleChange}
        isSearchable
        pagination={pagination}
        sortOptions={sortOptions}
        sortDefaultValue={filters.sort}
        filterComponents
      />
    </Page>
  );
}
