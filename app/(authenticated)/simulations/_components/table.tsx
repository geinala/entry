"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { ItemMedia } from "@/app/_components/ui/item";
import { FileText } from "lucide-react";
import { useGetSimulationLogsQuery } from "../_hooks/use-queries";
import DataTable from "@/app/_components/data-table";
import { useFilters } from "@/app/_hooks/use-filters";
import { useEffect, useState } from "react";
import { IndexQueryParams, TIndexQueryParams } from "@/types/query-params";
import { format } from "date-fns";

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
    <Card className="gap-2 w-full h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ItemMedia variant={"icon"} className="bg-blue-100 border-0 h-full size-10">
              <FileText className="text-blue-500 w-full h-full" />
            </ItemMedia>
            <div>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>List of recent simulation activities.</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="w-full h-full">
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
      </CardContent>
    </Card>
  );
}
