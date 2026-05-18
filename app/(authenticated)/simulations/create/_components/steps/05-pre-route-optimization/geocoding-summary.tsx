import { Title } from "@/app/_components/typography";
import { Table, TableBody, TableCell, TableRow } from "@/app/_components/ui/table";
import { TSimulationJobGeocodingSummary } from "@/types/database";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/app/_components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Separator } from "@/app/_components/ui/separator";

interface IProps {
  data?: TSimulationJobGeocodingSummary;
}

export const GeocodingSummary = ({ data }: IProps) => {
  const rows = [
    { label: "Auto Resolved (by System)", value: data?.autoResolved.toString() },
    {
      label: "Manual Corrected (by User)",
      value: data?.manuallyCorrected.toString(),
    },
    {
      label: "Ignored",
      value: data?.ignored.toString(),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="text-left font-medium flex gap-3 items-center cursor-pointer">
          <Title level={3}>Geocoding Summary</Title>
          <ChevronsUpDown className="h-6 w-6" />
        </CollapsibleTrigger>
        <Separator className="mt-3" />
        <CollapsibleContent>
          <Table className="table-fixed">
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
