"use client";

import { FileText } from "lucide-react";
import DataTable from "@/app/_components/data-table";
import { useFilters } from "@/app/_hooks/use-filters";
import { useEffect, useState } from "react";
import { IndexQueryParams, TIndexQueryParams } from "@/types/query-params";
import { format } from "date-fns";
import { useGetSimulationLogsQuery } from "../../_hooks/use-queries";
import SummaryContainer from "../summary-container";
import { Badge } from "@/app/_components/ui/badge";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";

interface ILogTable {
  simulationId: string;
}

export default function SimulationLogTable({ simulationId }: ILogTable) {
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
            accessorKey: "logLevel",
            header: "Log Level",
            cell: ({ row }) => {
              return <Badge variant="info">{row.original.logLevel.toUpperCase()}</Badge>;
            },
          },
          {
            accessorKey: "createdAt",
            header: "Timestamp",
            cell: ({ row }) => {
              const createdAt = row.original.createdAt;
              return (
                <p className="flex items-center gap-2">{format(new Date(createdAt), "HH:mm")}</p>
              );
            },
          },
          {
            accessorKey: "title",
            header: "Title",
          },
          {
            accessorKey: "eventType",
            header: "Event Type",
            cell: ({ row }) => {
              return row.original.eventType.toUpperCase();
            },
          },
          {
            id: "hasDetails",
            cell: ({ row }) => {
              return row.original.metadata ? (
                <Link href={`/simulations/${simulationId}/logs/${row.original.id}`}>
                  <Button variant={"link"}>View Details</Button>
                </Link>
              ) : (
                "-"
              );
            },
          },
        ]}
      />
    </SummaryContainer>
  );
}
