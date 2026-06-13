"use client";

import Page from "@/app/_components/page";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useGetSimulationLogByIdQuery } from "./_hooks/use-queries";
import { Card, CardContent } from "@/app/_components/ui/card";
import ReactJson from "react-json-view";
import { Table, TableBody, TableCell, TableRow } from "@/app/_components/ui/table";
import { Badge } from "@/app/_components/ui/badge";
import { format } from "date-fns";

export const SimulationLogDetailsPage = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  const { id, logId } = useParams<{ id: string; logId: string }>();

  const { data, isLoading } = useGetSimulationLogByIdQuery(id!, logId!);

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Simulations",
        href: "/simulations",
      },
      {
        label: `Simulation ${id}`,
        href: `/simulations/${id}`,
      },
      {
        label: `Log ${logId}`,
        href: `/simulations/${id}/logs/${logId}`,
      },
    ]);
  }, [setBreadcrumbs, id, logId]);

  return (
    <Page
      title={`Log ${logId} - Simulation ${id}`}
      isLoading={isLoading}
      description={`Details of log ${logId} for simulation ${id}.`}
    >
      <Card>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Log ID</TableCell>
                <TableCell>{logId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Event Type</TableCell>
                <TableCell>{data?.eventType?.toUpperCase()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Log Level</TableCell>
                <TableCell>
                  <Badge variant="outline">{data?.logLevel?.toUpperCase()}</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Courier</TableCell>
                <TableCell>{data?.courier?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Title</TableCell>
                <TableCell>{data?.title}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Description</TableCell>
                <TableCell>{data?.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Metadata</TableCell>
                <TableCell>
                  <ReactJson
                    src={data?.metadata ? data.metadata : {}}
                    name={false}
                    enableClipboard={true}
                    displayDataTypes={false}
                    collapsed
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Timestamp</TableCell>
                <TableCell>
                  {data?.createdAt ? format(new Date(data.createdAt), "PPPppp") : null}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Page>
  );
};

export default SimulationLogDetailsPage;
