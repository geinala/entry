import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import DataTable, { IDataTableProps } from "@/app/_components/data-table";
import { Button } from "@/app/_components/ui/button";
import {
  formatDateTime,
  TSimulationUploadedRowWithErrors,
  TValidationErrorItem,
} from "../../helpers";

interface IProps extends Omit<IDataTableProps<TSimulationUploadedRowWithErrors>, "columns"> {
  onEditRow: (row: TSimulationUploadedRowWithErrors) => void;
  onDeleteRow: (row: TSimulationUploadedRowWithErrors) => void;
  isDeletingRow: boolean;
}

export const ErrorRowsTable: React.FC<IProps> = ({
  onEditRow,
  onDeleteRow,
  isDeletingRow,
  ...props
}) => {
  const columns: ColumnDef<TSimulationUploadedRowWithErrors>[] = [
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onEditRow(row.original)}>
            <Pencil className="mr-2 size-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => void onDeleteRow(row.original)}
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
      accessorKey: "startDatetime",
      header: "Start",
      cell: ({ row }) => formatDateTime(row.original.startDatetime),
    },
    {
      accessorKey: "endDatetime",
      header: "End",
      cell: ({ row }) => formatDateTime(row.original.endDatetime),
    },
    {
      accessorKey: "courier",
      header: "Courier",
      cell: ({ row }) => row.original.courier || "-",
    },
    {
      accessorKey: "customerName",
      header: "Customer Name",
      cell: ({ row }) => row.original.customerName || "-",
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
      accessorKey: "weight",
      header: "Weight",
      cell: ({ row }) => row.original.weight || "-",
    },
    {
      accessorKey: "errorDetails",
      header: "Validation Errors",
      cell: ({ row }) => {
        const errors: TValidationErrorItem[] = row.original.normalizedErrorDetails;

        return (
          <div className="space-y-1">
            {errors.map((error, index) => (
              <div key={`${row.original.id}-${index}`} className="text-sm">
                <span className="font-medium">{error.field_name ?? "Unknown field"}</span>
                {": "}
                <span>{error.error_message ?? "-"}</span>
                {error.invalid_value ? ` (Invalid: ${error.invalid_value})` : ""}
                {error.row_number ? ` [Row: ${error.row_number}]` : ""}
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} {...props} />;
};

export default ErrorRowsTable;
