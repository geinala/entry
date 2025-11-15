import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/shared/ui/checkbox";
import { Search } from "@/shared/ui/search";
import type { TFilterItem } from "@/shared/types/filter";
import { TanstackTableView } from "@/shared/ui/table/tanstack-table-view";
import type { TSource } from "@/shared/types/pagination";
import { PaginationControl } from "@/shared/ui/pagination/pagination-control";

interface IDataTableProps<T> {
  enableRowSelection?: boolean;
  columns: ColumnDef<T>[];
  source?: TSource<T[]>;
  filters?: TFilterItem[];
  search?: string;
  withSearch?: boolean;
  placeholderSearch?: string;
  handleChange?: {
    onFilterChange: (newFilters: Record<string, string | number | undefined>) => void;
    onSortingChange: (sortKey: string, order: "asc" | "desc") => void;
    onPaginationChange: (page: number, limit: number) => void;
    onSearch: (searchTerm: string) => void;
  };
}

export const DataTable = <T,>({
  columns,
  enableRowSelection,
  source,
  search,
  placeholderSearch = "Search...",
  withSearch = true,
  handleChange,
}: IDataTableProps<T>) => {
  const { data, meta } = source || {};

  const selectableColumn: ColumnDef<T> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const table = useReactTable({
    data: data || [],
    columns: enableRowSelection ? [selectableColumn, ...columns] : columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: meta?.totalPages,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Table toolbar */}
      <div className="flex justify-between gap-2">
        {/* Filter component */}

        {/* Search components */}
        {withSearch && (
          <Search
            onSearch={handleChange?.onSearch}
            search={search}
            placeholderSearch={placeholderSearch}
          />
        )}
      </div>

      {/* Table components */}
      <div className="overflow-hidden rounded-md border my-2">
        <TanstackTableView table={table} />
      </div>

      {/* Pagination */}
      <div className="flex justify-end flex-col items-center gap-2 md:flex-row">
        {meta && (
          <PaginationControl
            paginationMeta={meta}
            onPaginationChange={handleChange?.onPaginationChange ?? (() => {})}
          />
        )}
      </div>
    </div>
  );
};
