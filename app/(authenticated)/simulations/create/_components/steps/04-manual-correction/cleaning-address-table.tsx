import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, X } from "lucide-react";

import DataTable, { IDataTableProps } from "@/app/_components/data-table";
import { Button } from "@/app/_components/ui/button";
import { TSimulationUploadedRow } from "@/types/database";
import { toast } from "sonner";

interface IProps extends Omit<IDataTableProps<TSimulationUploadedRow>, "columns"> {
  onEditRow: (row: TSimulationUploadedRow) => void;
  onDeleteRow: (row: TSimulationUploadedRow) => void;
  isDeletingRow: boolean;
}

export const CleaningAddressTable: React.FC<IProps> = ({ isDeletingRow, ...props }) => {
  const columns: ColumnDef<TSimulationUploadedRow>[] = [
    {
      accessorKey: "nosi",
      header: "No SI",
      cell: ({ row }) => row.original.nosi || "-",
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => row.original.address || "-",
    },
    {
      accessorKey: "finalAddress",
      header: "Final Address",
      cell: ({ row }) => row.original.finalAddress || "-",
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.error("Edit functionality is not implemented yet.");
            }}
          >
            <Pencil />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              toast.error("Delete functionality is not implemented yet.");
            }}
            disabled={isDeletingRow}
          >
            <X />
            Ignore
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} {...props} />;
};

export default CleaningAddressTable;
