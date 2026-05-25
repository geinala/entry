"use client";

import { FileText } from "lucide-react";
import DataTable from "@/app/_components/data-table";
import { useFilters } from "@/app/_hooks/use-filters";
import { useEffect, useState } from "react";
import { IndexQueryParams, TIndexQueryParams } from "@/types/query-params";
import { format } from "date-fns";
import { useGetSimulationLogsQuery } from "../../_hooks/use-queries";
import SummaryContainer from "../summary-container";

interface ILogTable {
  simulationId: string;
}

export default function LogTable({ simulationId }: ILogTable) {
  const { handleChange, pagination } = useFilters(IndexQueryParams);

  const [localPagination, setLocalPagination] = useState(() => ({
    page: pagination.page,
    pageSize: pagination.pageSize,
  }));

  useEffect(() => {
    setLocalPagination({ page: pagination.page, pageSize: pagination.pageSize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wrappedHandleChange = {
    ...handleChange,
    onPaginationChange: (page: number, pageSize: number) => {
      setLocalPagination({ page: page > 0 ? page : 1, pageSize: pageSize > 0 ? pageSize : 10 });
    },
  };

  const { data, isLoading } = useGetSimulationLogsQuery({
    queryParams: {
      ...localPagination,
    } as TIndexQueryParams,
    simulationId,
  });

  return (
    <SummaryContainer
      title="Activity Log"
      description="List of recent simulation activities."
      icon={<FileText className="text-primary w-full h-full" />}
    >
      <DataTable
        isLoading={isLoading}
        isSearchable={false}
        handleChange={wrappedHandleChange}
        pagination={localPagination}
        source={data}
        columns={[
          {
            accessorKey: "createdAt",
            header: "Timestamp",
            cell: ({ row }) => {
              const createdAt = row.original.createdAt;
              return (
                <div className="flex items-center gap-2">
                  <span>[{format(new Date(createdAt), "HH:mm")}]</span>
                </div>
              );
            },
          },
          {
            accessorKey: "title",
            header: "Title",
          },
        ]}
      />
    </SummaryContainer>
  );
}
