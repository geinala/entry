"use client";

import DataTable from "@/app/_components/data-table";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { User } from "@/types/database";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useGetUsers } from "./_hooks/use-get-users";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexQueryParams } from "@/types/query-params";
import Page from "@/app/_components/page";

export default function UsersPage() {
  console.log("RENDER USERS PAGE");
  const { setBreadcrumbs } = useBreadcrumb();
  const { handleChange, pagination, filters, search } = useFilters(IndexQueryParams);

  const { data, isLoading } = useGetUsers({
    ...pagination,
    search: filters.search,
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
      />
    </Page>
  );
}
