"use client";

import SummaryContainer from "@/app/(authenticated)/simulations/_components/summary-container";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useGetFullRouteComparisonQuery } from "../../_hooks/use-queries";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { Badge } from "@/app/_components/ui/badge";
import { Marker } from "@/app/_components/map";
import { Route } from "@/app/_components/map/route";
import { useMemo } from "react";
import {
  calculatePercentageChange,
  decodePolyline,
  formatSeconds,
  getAutoZoom,
  getRouteCenter,
  metersToKm,
} from "@/lib/utils";
import { getRouteNodeStyle } from "../../../../_utils/map-route-data";
import type { TFullRouteComparison } from "@/types/database";
import { Separator } from "@/app/_components/ui/separator";
import { EqualApproximately, Map, MoveRight, TrendingDown, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";

const TomTomMap = dynamic(
  () => import("@/app/_components/map").then((module) => module.TomTomMap),
  { ssr: false },
);

type FullRouteComparisonNode = {
  lat: number;
  lng: number;
  sequence: number;
};

type RouteLeg = TFullRouteComparison["beforeRoute"][number];

const buildRouteNodes = (routeLegs: RouteLeg[] = []): FullRouteComparisonNode[] => {
  const nodes: FullRouteComparisonNode[] = [];
  const seenCoordinates = new Set<string>();

  routeLegs.forEach((routeLeg, index) => {
    if (index === 0) {
      const originKey = `${routeLeg.originLatitude.toFixed(6)},${routeLeg.originLongitude.toFixed(6)}`;

      if (!seenCoordinates.has(originKey)) {
        seenCoordinates.add(originKey);
        nodes.push({
          lat: routeLeg.originLatitude,
          lng: routeLeg.originLongitude,
          sequence: nodes.length,
        });
      }
    }

    const destinationKey = `${routeLeg.destinationLatitude.toFixed(6)},${routeLeg.destinationLongitude.toFixed(6)}`;

    if (!seenCoordinates.has(destinationKey)) {
      seenCoordinates.add(destinationKey);
      nodes.push({
        lat: routeLeg.destinationLatitude,
        lng: routeLeg.destinationLongitude,
        sequence: nodes.length,
      });
    }
  });

  return nodes;
};

export const FullRouteComparison = () => {
  const { id, eventId } = useParams<{ id: string; eventId: string }>();

  const { data, isLoading } = useGetFullRouteComparisonQuery(id, Number(eventId));

  const beforeRouteCoordinates = useMemo(
    () =>
      (data?.beforeRoute ?? []).flatMap((routeLeg) =>
        decodePolyline(routeLeg.encodedPolyline, routeLeg.encodedPolylinePrecision),
      ),
    [data?.beforeRoute],
  );
  const beforeRouteNodes = useMemo(() => buildRouteNodes(data?.beforeRoute), [data?.beforeRoute]);
  const beforeCenterCoor = useMemo(
    () => getRouteCenter(beforeRouteCoordinates),
    [beforeRouteCoordinates],
  );
  const beforeZoom = useMemo(() => getAutoZoom(beforeRouteCoordinates), [beforeRouteCoordinates]);
  const afterRouteCoordinates = useMemo(
    () =>
      (data?.afterRoute ?? []).flatMap((routeLeg) =>
        decodePolyline(routeLeg.encodedPolyline, routeLeg.encodedPolylinePrecision),
      ),
    [data?.afterRoute],
  );
  const afterRouteNodes = useMemo(() => buildRouteNodes(data?.afterRoute), [data?.afterRoute]);
  const afterCenterCoor = useMemo(
    () => getRouteCenter(afterRouteCoordinates),
    [afterRouteCoordinates],
  );
  const afterZoom = useMemo(() => getAutoZoom(afterRouteCoordinates), [afterRouteCoordinates]);
  const distanceDiff = useMemo(
    () => (data?.beforeTotalDistanceInMeters ?? 0) - (data?.afterTotalDistanceInMeters ?? 0),
    [data?.beforeTotalDistanceInMeters, data?.afterTotalDistanceInMeters],
  );
  const distanceState = useMemo(
    () => (distanceDiff > 0 ? "saved" : distanceDiff < 0 ? "added" : "neutral"),
    [distanceDiff],
  );
  const timeDiff = useMemo(
    () => (data?.beforeTotalTimeInSeconds ?? 0) - (data?.afterTotalTimeInSeconds ?? 0),
    [data?.beforeTotalTimeInSeconds, data?.afterTotalTimeInSeconds],
  );
  const timeState = useMemo(
    () => (timeDiff > 0 ? "saved" : timeDiff < 0 ? "added" : "neutral"),
    [timeDiff],
  );

  const classesForState = (
    state: string,
    savedClass: string,
    addedClass: string,
    neutralClass = "",
  ) => {
    if (state === "saved") return savedClass;
    if (state === "added") return addedClass;
    return neutralClass;
  };

  const iconForState = (state: string) => {
    if (state === "saved") return <TrendingDown strokeWidth={1.5} />;
    if (state === "added") return <TrendingUp strokeWidth={1.5} />;
    return <EqualApproximately strokeWidth={1.5} />;
  };

  const labelForState = (state: string, type: string) => {
    if (state === "saved") return `${type} Saved`;
    if (state === "added") return `${type} Added`;
    return `${type} Unchanged`;
  };

  if (isLoading) {
    return (
      <SummaryContainer
        title="Full Route Comparison"
        description="Comparison of the full route before and after reoptimization. This visualization provides an overview of how the entire route has changed as a result of the reoptimization, allowing users to see the overall impact on the route structure and identify any significant deviations from the original path."
      >
        <Skeleton className="w-full h-48" />
      </SummaryContainer>
    );
  }

  return (
    <SummaryContainer
      title="Full Route Comparison"
      description="Comparison of the full route before and after reoptimization. This visualization provides an overview of how the entire route has changed as a result of the reoptimization, allowing users to see the overall impact on the route structure and identify any significant deviations from the original path."
      icon={<Map className="text-primary w-full h-full" />}
    >
      <div className="grid grid-cols-4 gap-3">
        <Card
          className={classesForState(
            distanceState,
            "text-emerald-600 bg-emerald-50 border-emerald-600",
            "text-rose-600 bg-rose-50 border-rose-600",
            "",
          )}
        >
          <CardHeader className="flex justify-between items-start h-full">
            <CardTitle>Total Distance</CardTitle>
            <CardDescription
              className={`flex items-center gap-1 ${classesForState(distanceState, "text-emerald-600", "text-rose-600", "")}`}
            >
              {iconForState(distanceState)}
              {calculatePercentageChange(
                data?.beforeTotalDistanceInMeters ?? 0,
                data?.afterTotalDistanceInMeters ?? 0,
              ).toFixed(2)}
              %
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <span>{metersToKm(data?.beforeTotalDistanceInMeters ?? 0)} km</span>
              <MoveRight className="inline mx-2" />
              <span>{metersToKm(data?.afterTotalDistanceInMeters ?? 0)} km</span>
            </div>
          </CardContent>
        </Card>
        <Card
          className={classesForState(
            distanceState,
            "text-emerald-600 bg-emerald-50 border-emerald-600",
            "text-rose-600 bg-rose-50 border-rose-600",
            "",
          )}
        >
          <CardHeader className="flex justify-between items-start h-full">
            <CardTitle>{labelForState(distanceState, "Distance")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <span>
                {metersToKm(
                  (data?.beforeTotalDistanceInMeters ?? 0) -
                    (data?.afterTotalDistanceInMeters ?? 0),
                )}{" "}
                km
              </span>
            </div>
          </CardContent>
        </Card>
        <Card
          className={classesForState(
            timeState,
            "text-emerald-600 bg-emerald-50 border-emerald-600",
            "text-rose-600 bg-rose-50 border-rose-600",
            "",
          )}
        >
          <CardHeader className="flex justify-between items-start h-full">
            <CardTitle>Total Duration</CardTitle>
            <CardDescription
              className={`flex items-center gap-1 ${classesForState(timeState, "text-emerald-600", "text-rose-600", "")}`}
            >
              {iconForState(timeState)}
              {calculatePercentageChange(
                data?.beforeTotalTimeInSeconds ?? 0,
                data?.afterTotalTimeInSeconds ?? 0,
              ).toFixed(2)}
              %
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <span>
                {formatSeconds(data?.beforeTotalTimeInSeconds ?? 0, [
                  "hours",
                  "minutes",
                  "seconds",
                ])}
              </span>
              <MoveRight className="inline mx-2" />
              <span>
                {formatSeconds(data?.afterTotalTimeInSeconds ?? 0, ["hours", "minutes", "seconds"])}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card
          className={classesForState(
            timeState,
            "border-emerald-600 bg-emerald-50",
            "border-rose-600 bg-rose-50",
            "border",
          )}
        >
          <CardHeader>
            <CardTitle
              className={classesForState(timeState, "text-emerald-600", "text-rose-600", "")}
            >
              {labelForState(timeState, "Time")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <span className={classesForState(timeState, "text-emerald-600", "text-rose-600", "")}>
                {formatSeconds(Math.abs(data?.timeSavedInSeconds ?? 0), [
                  "hours",
                  "minutes",
                  "seconds",
                ])}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Separator className="my-3" />
      <div className="grid grid-cols-2 gap-3 min-h-160">
        <div className="w-full flex flex-col gap-3 h-160">
          <Badge variant="outline">Before</Badge>
          <div className="relative h-full">
            <TomTomMap
              center={beforeCenterCoor}
              showTrafficFlow={false}
              showTrafficIncidents={false}
              zoom={beforeZoom}
              disableInteractions
            >
              {(data?.beforeRoute ?? []).map((routeLeg) => (
                <Route
                  key={routeLeg.id}
                  coordinates={decodePolyline(
                    routeLeg.encodedPolyline,
                    routeLeg.encodedPolylinePrecision,
                  )}
                  label="Before"
                  color="blue"
                  width={2}
                />
              ))}
              {beforeRouteNodes.map((node) => {
                const nodeStyle = getRouteNodeStyle("visited");

                return (
                  <Marker
                    key={`before-node-${node.sequence}-${node.lat}-${node.lng}`}
                    lat={node.lat}
                    lng={node.lng}
                    icon={<span>{node.sequence}</span>}
                    className="w-8 h-8"
                    style={{
                      borderRadius: "9999px",
                      border: `2px solid ${nodeStyle.borderColor}`,
                      backgroundColor: "#ffffff",
                      color: nodeStyle.textColor,
                      fontWeight: "700",
                      fontSize: "12px",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: "1",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.25)",
                    }}
                  />
                );
              })}
            </TomTomMap>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
          <Badge variant="outline">After</Badge>
          <div className="relative h-full">
            <TomTomMap
              center={afterCenterCoor}
              showTrafficFlow={false}
              showTrafficIncidents={false}
              zoom={afterZoom}
              disableInteractions
            >
              {(data?.afterRoute ?? []).map((routeLeg) => (
                <Route
                  key={routeLeg.id}
                  coordinates={decodePolyline(
                    routeLeg.encodedPolyline,
                    routeLeg.encodedPolylinePrecision,
                  )}
                  label="After"
                  color="green"
                  width={2}
                />
              ))}
              {afterRouteNodes.map((node) => {
                const nodeStyle = getRouteNodeStyle("visited");

                return (
                  <Marker
                    key={`after-node-${node.sequence}-${node.lat}-${node.lng}`}
                    lat={node.lat}
                    lng={node.lng}
                    icon={<span>{node.sequence}</span>}
                    className="w-8 h-8"
                    style={{
                      borderRadius: "9999px",
                      border: `2px solid ${nodeStyle.borderColor}`,
                      backgroundColor: "#ffffff",
                      color: nodeStyle.textColor,
                      fontWeight: "700",
                      fontSize: "12px",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: "1",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.25)",
                    }}
                  />
                );
              })}
            </TomTomMap>
          </div>
        </div>
      </div>
    </SummaryContainer>
  );
};
