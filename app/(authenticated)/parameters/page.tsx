"use client";

import DataTable from "@/app/_components/data-table";
import Page from "@/app/_components/page";
import { Button } from "@/app/_components/ui/button";
import { useFilters } from "@/app/_hooks/use-filters";
import { Ellipsis, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { TTuningExperimentDataset } from "@/types/database";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { useEffect } from "react";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { IndexQueryParams } from "@/types/query-params";
import { useGetParametersWithPaginationQuery } from "./_hooks/use-queries";

export default function ParametersPage() {
  const { setBreadcrumbs } = useBreadcrumb();

  const { handleChange, pagination, search } = useFilters(IndexQueryParams);
  const { data, isLoading } = useGetParametersWithPaginationQuery({
    ...pagination,
    search,
  });

  useEffect(() => {
    setBreadcrumbs([{ label: "Parameters", href: "/parameters" }]);
  }, [setBreadcrumbs]);

  const columns: ColumnDef<TTuningExperimentDataset>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "filePath",
      header: "File Path",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
    {
      id: "action",
      size: 50,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon-sm">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <Link href={`/parameters/${row.original.id}`}>
                <DropdownMenuItem>
                  <Eye className="me-1" />
                  View Parameter
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <Page
      title="Parameters"
      isLoading={isLoading}
      description="Manage and view all parameters associated with your simulations."
      headerAction={
        <Link href="/parameters/create">
          <Button variant={"outline"} size={"sm"}>
            <Plus />
            Add Parameter
          </Button>
        </Link>
      }
    >
      <DataTable
        handleChange={handleChange}
        pagination={pagination}
        search={search}
        columns={columns}
        source={data}
        isLoading={isLoading}
        isSearchable={false}
      />
    </Page>
  );
}
