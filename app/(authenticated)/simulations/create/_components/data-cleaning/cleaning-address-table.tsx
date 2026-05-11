import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

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
            <Pencil className="mr-2 size-4" />
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
            <Trash2 className="mr-2 size-4" />
            Delete
          </Button>
        </div>
      ),
    },
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
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => row.original.city || "-",
    },
    {
      accessorKey: "cleanedAddress",
      header: "Cleaned Address",
      cell: ({ row }) => row.original.cleanedAddress || "-",
    },
    {
      accessorKey: "streetCandidate",
      header: "Street Candidate",
      cell: ({ row }) => row.original.streetCandidate || "-",
    },
    {
      accessorKey: "finalAddress",
      header: "Final Address",
      cell: ({ row }) => row.original.finalAddress || "-",
    },
  ];

  return <DataTable columns={columns} {...props} />;
};

export default CleaningAddressTable;
