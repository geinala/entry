import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import DataTable, { IDataTableProps } from "@/app/_components/data-table";
import { Button } from "@/app/_components/ui/button";
import {
  formatDateTime,
  TSimulationUploadedRowWithErrors,
  TValidationErrorItem,
} from "../../../_utils/helpers";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { BulkDeleteErrorRowsButton } from "./actions/bulk-delete.button";

interface IProps extends Omit<IDataTableProps<TSimulationUploadedRowWithErrors>, "columns"> {
  jobId: string;
  onEditRow: (row: TSimulationUploadedRowWithErrors) => void;
  onDeleteRow: (row: TSimulationUploadedRowWithErrors) => void;
  isDeletingRow: boolean;
}

const ErrorRowsTable: React.FC<IProps> = ({
  jobId,
  onEditRow,
  onDeleteRow,
  isDeletingRow,
  ...props
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectRow = (id: number, isSelected: boolean) => {
    setSelectedIds((prevSelected) => {
      if (isSelected) {
        return [...prevSelected, id];
      } else {
        return prevSelected.filter((selectedId) => selectedId !== id);
      }
    });
  };

  const columns: ColumnDef<TSimulationUploadedRowWithErrors>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getRowModel().rows.length > 0 &&
            selectedIds.length === table.getRowModel().rows.length
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (value) {
              const allIds = table.getRowModel().rows.map((row) => row.original.id);
              setSelectedIds(allIds);
            } else {
              setSelectedIds([]);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedIds.includes(row.original.id)}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            handleSelectRow(row.original.id, !!value);
          }}
          aria-label="Select row"
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onEditRow(row.original)}>
            <Pencil />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => void onDeleteRow(row.original)}
            disabled={isDeletingRow}
          >
            <Trash2 />
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

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-end">
        <BulkDeleteErrorRowsButton jobId={jobId} selectedRowIds={selectedIds} />
      </div>
      <DataTable columns={columns} {...props} />
    </div>
  );
};

export default ErrorRowsTable;
