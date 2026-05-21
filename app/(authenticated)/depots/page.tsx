"use client";

import DataTable from "@/app/_components/data-table";
import Page from "@/app/_components/page";
import { Button } from "@/app/_components/ui/button";
import { useFilters } from "@/app/_hooks/use-filters";
import { Ellipsis, Eye, Plus, Settings, Trash } from "lucide-react";
import Link from "next/link";
import { useGetDepotsWithPaginationQuery } from "./_hooks/use-queries";
import { ColumnDef } from "@tanstack/react-table";
import { TDepot } from "@/types/database";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Dialog } from "@/app/_components/ui/dialog";
import { DeleteConfirmationDialog } from "./_components/delete-confirmation.dialog";
import { useDeleteDepotMutation } from "./_hooks/use-mutations";
import { useEffect, useState } from "react";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { IndexQueryParams } from "@/types/query-params";

export default function DepotsPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepot, setSelectedDepot] = useState<TDepot | null>(null);
  const { setBreadcrumbs } = useBreadcrumb();

  const { handleChange, pagination, search } = useFilters(IndexQueryParams);
  const { data, isLoading } = useGetDepotsWithPaginationQuery({
    ...pagination,
    search,
  });

  const { mutateAsync, isPending } = useDeleteDepotMutation();

  useEffect(() => {
    setBreadcrumbs([{ label: "Depots", href: "/depots" }]);
  }, [setBreadcrumbs]);

  const columns: ColumnDef<TDepot>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "latitude",
      header: "Latitude",
    },
    {
      accessorKey: "longitude",
      header: "Longitude",
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
              <Link href={`/depots/${row.original.id}`}>
                <DropdownMenuItem>
                  <Eye className="me-1" />
                  View Depot
                </DropdownMenuItem>
              </Link>
              <Link href={`/depots/${row.original.id}/update`}>
                <DropdownMenuItem>
                  <Settings className="me-1" />
                  Edit Depot
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setSelectedDepot(row.original);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash className="me-1" />
                Delete Depot
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <Dialog
      open={isDeleteDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedDepot(null);
        }
      }}
    >
      <Page
        title="Depots"
        isLoading={isLoading}
        description="Manage and view all depots associated with your simulations."
        headerAction={
          <Link href="/depots/create">
            <Button variant={"outline"} size={"sm"}>
              <Plus />
              Add Depot
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
          isSearchable
          placeholderSearch="Search by name or address..."
        />
      </Page>

      <DeleteConfirmationDialog
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          (async () => {
            if (!selectedDepot) return;

            try {
              await mutateAsync(selectedDepot.id);
            } finally {
              setIsDeleteDialogOpen(false);
            }
          })();
        }}
        isLoading={isPending}
      />
    </Dialog>
  );
}
