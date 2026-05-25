"use client";

import SimulationsLayoutShell from "../_components/layout-shell";
import { SimulationDetailLeftSidebar, SimulationDetailRightSidebar } from "./_components/sidebar";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect, useMemo, useState } from "react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Loading from "@/app/_components/loading";
import { Route } from "next";
import { Empty, EmptyContent, EmptyDescription } from "@/app/_components/ui/empty";
import { useGetSimulationByIdQuery } from "../_hooks/use-queries";
import { isNotFoundError } from "@/common/exception/helper";
import { Dialog } from "@/app/_components/ui/dialog";
import { ConstraintsFormDialog } from "./_components/dialog";
import {
  EVENT_TYPES,
  eventHandlers,
  parseEventData,
  shouldHandleSimulationEvent,
} from "@/lib/events";
import { useQueryClient } from "@tanstack/react-query";
import { useGetFinalRoutesQuery } from "./_hooks/use-queries";
import type { SimulationVehicleTick } from "./_components/map";
import type { TLatestRouteBySimulationRow } from "@/types/database";

const Map = dynamic(() => import("./_components/map"), {
  loading: () => <Loading />,
  ssr: false,
});

const parseCourierId = (courierId: string | null) => {
  if (!courierId) {
    return undefined;
  }

  const parsedCourierId = Number(courierId);

  return Number.isFinite(parsedCourierId) ? parsedCourierId : undefined;
};

const normalizeVehicleTick = (vehicle: unknown): SimulationVehicleTick | null => {
  if (typeof vehicle !== "object" || vehicle === null) {
    return null;
  }

  const vehicleRecord = vehicle as Record<string, unknown>;

  if (
    typeof vehicleRecord.id !== "number" ||
    typeof vehicleRecord.lat !== "number" ||
    typeof vehicleRecord.lng !== "number"
  ) {
    return null;
  }

  return {
    id: vehicleRecord.id,
    courierId:
      typeof vehicleRecord.courierId === "number" ? vehicleRecord.courierId : vehicleRecord.id,
    courierRouteId:
      typeof vehicleRecord.courierRouteId === "number"
        ? vehicleRecord.courierRouteId
        : vehicleRecord.id,
    routeLegId: typeof vehicleRecord.routeLegId === "number" ? vehicleRecord.routeLegId : 0,
    sequence: typeof vehicleRecord.sequence === "number" ? vehicleRecord.sequence : 0,
    lat: vehicleRecord.lat,
    lng: vehicleRecord.lng,
    speed: typeof vehicleRecord.speed === "number" ? vehicleRecord.speed : 0,
    progress: typeof vehicleRecord.progress === "number" ? vehicleRecord.progress : 0,
    status: typeof vehicleRecord.status === "string" ? vehicleRecord.status : "unknown",
  };
};

const filterRoutesByCourierId = (
  routes: TLatestRouteBySimulationRow[] | undefined,
  courierId?: number,
) => {
  if (courierId === undefined) {
    return routes;
  }

  return routes?.filter((route) => route.courier?.id === courierId);
};

export default function SimulationDetailPage() {
  const { id: simulationId } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const selectedCourierId = parseCourierId(searchParams.get("courierId"));
  const { setBreadcrumbs } = useBreadcrumb();
  const { data, isLoading, error } = useGetSimulationByIdQuery(simulationId);
  const { data: finalRoutesData } = useGetFinalRoutesQuery(simulationId, selectedCourierId);
  const queryClient = useQueryClient();
  const [vehicleTickState, setVehicleTickState] = useState<{
    simulationId: string;
    vehicles: SimulationVehicleTick[];
  }>({
    simulationId,
    vehicles: [],
  });

  const vehicleTicks = useMemo(
    () => (vehicleTickState.simulationId === simulationId ? vehicleTickState.vehicles : []),
    [simulationId, vehicleTickState],
  );

  const visibleRoutes = useMemo(
    () => filterRoutesByCourierId(finalRoutesData, selectedCourierId),
    [finalRoutesData, selectedCourierId],
  );

  const visibleVehicleTicks = useMemo(
    () =>
      selectedCourierId === undefined
        ? vehicleTicks
        : vehicleTicks.filter((vehicle) => vehicle.courierId === selectedCourierId),
    [selectedCourierId, vehicleTicks],
  );

  if (isNotFoundError(error)) {
    notFound();
  }

  useEffect(() => {
    const es = new EventSource(`/api/events/stream?simulationId=${simulationId}`);

    const handlers = EVENT_TYPES.map((eventType) => {
      const handler = (event: MessageEvent<string>) => {
        const payload = parseEventData(event.data);

        if (!shouldHandleSimulationEvent(payload, simulationId)) {
          return;
        }

        eventHandlers[eventType]?.({ queryClient, payload, simulationId });
      };

      es.addEventListener(eventType, handler);
      return { eventType, handler };
    });

    const tickHandler = (event: MessageEvent<string>) => {
      const payload = parseEventData(event.data);

      if (
        !shouldHandleSimulationEvent(payload, simulationId) ||
        typeof payload !== "object" ||
        !payload
      ) {
        return;
      }

      const vehicles = Array.isArray(payload.vehicles)
        ? payload.vehicles
            .map(normalizeVehicleTick)
            .filter((vehicle): vehicle is SimulationVehicleTick => vehicle !== null)
        : [];

      setVehicleTickState({
        simulationId,
        vehicles,
      });
    };

    es.addEventListener("SIMULATION_TICK", tickHandler);

    return () => {
      handlers.forEach(({ eventType, handler }) => {
        es.removeEventListener(eventType, handler);
      });
      es.removeEventListener("SIMULATION_TICK", tickHandler);
      es.close();
    };
  }, [queryClient, simulationId]);

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Simulations",
        href: "/simulations",
      },
      {
        label: "Visualization",
        href: `/simulations/${simulationId}` as Route,
      },
    ]);
  }, [setBreadcrumbs, simulationId]);

  const isShowEmptyState = !isLoading && data?.status === "failed";

  return (
    <Dialog>
      <SimulationsLayoutShell
        leftSidebar={<SimulationDetailLeftSidebar status={data?.status} />}
        rightSidebar={<SimulationDetailRightSidebar data={data} />}
        isLoading={isLoading}
      >
        {isShowEmptyState && (
          <Empty>
            <EmptyContent>
              <EmptyDescription>
                Visualization for this simulation is not available yet. Please check back later.
              </EmptyDescription>
            </EmptyContent>
          </Empty>
        )}
        {!isShowEmptyState && data?.depot && (
          <Map
            center={[data.depot.longitude, data.depot.latitude]}
            zoom={18}
            pitch={200}
            bearing={-20}
            routes={visibleRoutes}
            vehicles={visibleVehicleTicks}
          />
        )}
      </SimulationsLayoutShell>

      <ConstraintsFormDialog />
    </Dialog>
  );
}
