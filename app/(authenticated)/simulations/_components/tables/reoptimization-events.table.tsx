"use client";

import { Route } from "lucide-react";
import { useGetReoptimizationEventsQuery } from "../../_hooks/use-queries";
import { convertUtcToLocalTime, snakeToText } from "@/lib/utils";
import { useFilters } from "@/app/_hooks/use-filters";
import DataTable from "@/app/_components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { TReoptimizationEvent } from "@/types/database";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { useEffect, useState } from "react";
import SummaryContainer from "../summary-container";
import CourierSelect from "../courier.select";
import { useGetAllCouriersQuery } from "../../[id]/_hooks/use-queries";
import { ReoptimizationEventTableIndexQueryParams } from "@/schemas/simulations/reoptimization-event.schema";

interface ILogTable {
  simulationId: string;
}

export default function ReoptimizationEventsTable({ simulationId }: ILogTable) {
  const { handleChange, pagination } = useFilters(ReoptimizationEventTableIndexQueryParams);
  const [selectedCourierId, setSelectedCourierId] = useState<string | null>(null);

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
      ...(selectedCourierId && {
        courierId: Number(selectedCourierId),
      }),
    },
  });

  const { data: couriersData, isLoading: isCouriersLoading } = useGetAllCouriersQuery(simulationId);

  const handleCourierChange = (courierId: string) => {
    setSelectedCourierId(courierId);
  };

  const columns: ColumnDef<TReoptimizationEvent>[] = [
    {
      id: "timestamp",
      header: "Check Time",
      cell: ({ row }) => {
        const timestamp = row.original.checkedAt;
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
      accessorKey: "incidentsFound",
      header: "Incident Found",
    },
    {
      accessorKey: "acceptedIncidentCount",
      header: "Accepted Incidents",
    },
    {
      accessorKey: "outcome",
      header: "Outcome",
      cell: ({ row }) => {
        const outcome = row.original.outcome;
        return (
          <>
            {outcome ? (
              snakeToText(outcome)
            ) : (
              <i className="text-destructive">No relevant incidents found</i>
            )}
          </>
        );
      },
    },
    {
      id: "actions",
      size: 50,
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
      headerRight={
        <CourierSelect
          couriers={couriersData ?? []}
          isLoading={isCouriersLoading}
          value={selectedCourierId ?? ""}
          onValueChange={handleCourierChange}
        />
      }
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
