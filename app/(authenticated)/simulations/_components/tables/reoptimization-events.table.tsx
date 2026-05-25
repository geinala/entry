"use client";

import { Route, Triangle } from "lucide-react";
import { useGetReoptimizationEventsQuery } from "../../_hooks/use-queries";
import { convertUtcToLocalTime, formatSeconds, snakeToText } from "@/lib/utils";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexQueryParams } from "@/types/query-params";
import DataTable from "@/app/_components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { TReoptimizationEvent } from "@/types/database";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { useEffect, useState } from "react";
import SummaryContainer from "../summary-container";

interface ILogTable {
  simulationId: string;
}

export default function ReoptimizationEventsTable({ simulationId }: ILogTable) {
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

  const { data, isLoading } = useGetReoptimizationEventsQuery({
    simulationId,
    queryParams: {
      ...localPagination,
    },
  });

  const columns: ColumnDef<TReoptimizationEvent>[] = [
    {
      id: "timestamp",
      header: "Time",
      cell: ({ row }) => {
        const timestamp = row.original.triggeredAt;
        return (
          <span>
            {convertUtcToLocalTime({
              utcDateStr: timestamp.toString(),
              format: "HH:mm",
            }).toString()}
          </span>
        );
      },
    },
    {
      id: "courier",
      header: "Courier",
      cell: ({ row }) => {
        const courier = row.original.courierName;
        return <span>{courier ? courier : "N/A"}</span>;
      },
    },
    {
      id: "segment",
      header: "Segment",
      cell: ({ row }) => {
        const fromNodeId = row.original.fromNodeId;
        const toNodeId = row.original.toNodeId;
        return (
          <span>
            {fromNodeId && toNodeId ? `From Node ${fromNodeId} to Node ${toNodeId}` : "N/A"}
          </span>
        );
      },
    },
    {
      id: "delay",
      header: "Traffic Delay",
      cell: ({ row }) => {
        const delay = row.original.incidentDelayInSeconds;
        return delay && delay > 0 ? (
          <span>{formatSeconds(delay, ["hours", "minutes", "seconds"])}</span>
        ) : (
          <span>N/A</span>
        );
      },
    },
    {
      accessorKey: "outcome",
      header: "Outcome",
      cell: ({ row }) => {
        const outcome = row.original.outcome;
        return <span>{outcome ? snakeToText(outcome) : "N/A"}</span>;
      },
    },
    {
      id: "duration",
      header: () => (
        <div className="flex items-center gap-1">
          <Triangle className="w-4 h-4" /> Duration saved
        </div>
      ),
      cell: ({ row }) => {
        const length = row.original.timeSavedInSeconds;
        const isUpdatedDuration = row.original.outcome === "duration_updated";
        return (
          <span>
            {!isUpdatedDuration ? formatSeconds(length, ["hours", "minutes", "seconds"]) : "-"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const eventId = row.original.id;
        return (
          <Link href={`/simulations/${simulationId}/events/${eventId}`} passHref>
            <Button variant={"link"} className="px-0">
              View Event
            </Button>
          </Link>
        );
      },
    },
  ];

  return (
    <SummaryContainer
      title="Reoptimization Events"
      description="Details of reoptimization events during the simulation."
      icon={<Route className="text-primary w-full h-full" />}
    >
      <DataTable
        columns={columns}
        source={data}
        handleChange={wrappedHandleChange}
        pagination={localPagination}
        isLoading={isLoading}
      />
    </SummaryContainer>
  );
}
