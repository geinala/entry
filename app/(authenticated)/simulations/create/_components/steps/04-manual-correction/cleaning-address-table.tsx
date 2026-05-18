import { FC, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, X } from "lucide-react";

import DataTable, { IDataTableProps } from "@/app/_components/data-table";
import { Button } from "@/app/_components/ui/button";
import { TSimulationUploadedRow } from "@/types/database";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { BulkIgnoreButton } from "./actions/bulk-ignore.button";
import EditFinalAddressDialog from "./dialog/edit-final-address.dialog";

interface IProps extends Omit<IDataTableProps<TSimulationUploadedRow>, "columns"> {
  jobId: string;
  onDeleteRow: (row: TSimulationUploadedRow) => void;
}

export const CleaningAddressTable: FC<IProps> = ({ jobId, onDeleteRow, ...props }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TSimulationUploadedRow | null>(null);

  const handleSelectRow = (id: number, isSelected: boolean) => {
    setSelectedIds((prevSelected) => {
      if (isSelected) {
        return [...prevSelected, id];
      } else {
        return prevSelected.filter((selectedId) => selectedId !== id);
      }
    });
  };

  const columns: ColumnDef<TSimulationUploadedRow>[] = [
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedRow(row.original);
              setIsEditDialogOpen(true);
            }}
          >
            <Pencil />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => void onDeleteRow(row.original)}>
            <X />
            Ignore
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-end">
          <BulkIgnoreButton jobId={jobId} selectedRowIds={selectedIds} />
        </div>
        <DataTable columns={columns} {...props} selectable />
      </div>

      <EditFinalAddressDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedRow={selectedRow}
        defaultValues={selectedRow?.finalAddress || ""}
        jobId={jobId}
      />
    </>
  );
};

export default CleaningAddressTable;
