"use client";

import Page from "@/app/_components/page";
import { useParams } from "next/navigation";
import { useGetDepotByIdQuery } from "../_hooks/use-queries";
import { Table, TableBody, TableCell, TableRow } from "@/app/_components/ui/table";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Marker, TomTomMap } from "@/app/_components/map";
import Image from "next/image";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";

export default function DepotPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetDepotByIdQuery(Number(id));
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    if (data) {
      setBreadcrumbs([
        { label: "Depots", href: "/depots" },
        { label: data.name, href: `/depots/${data.id}` },
      ]);
    }
  }, [data, setBreadcrumbs]);

  return (
    <Page
      title={`Depot ${data?.name}`}
      isLoading={isLoading}
      description={`Details and management for depot with ID ${data?.name}.`}
    >
      <Card>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">Name</TableCell>
                <TableCell>{data?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Address</TableCell>
                <TableCell>{data?.address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Latitude</TableCell>
                <TableCell>{data?.latitude}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Longitude</TableCell>
                <TableCell>{data?.longitude}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} className="text-center font-semibold p-3">
                  Location on Map
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} className="h-96">
                  {data?.latitude && data?.longitude && (
                    <TomTomMap
                      center={[data?.longitude, data?.latitude]}
                      zoom={14}
                      showTrafficFlow={false}
                      showTrafficIncidents={true}
                      style="monoLight"
                    >
                      <Marker
                        lat={data.latitude}
                        lng={data.longitude}
                        icon={
                          <Image
                            src="/images/depot.png"
                            alt="Depot"
                            width={96}
                            height={96}
                            unoptimized
                          />
                        }
                        style={{
                          width: "96px",
                          height: "96px",
                        }}
                      />
                    </TomTomMap>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Page>
  );
}
