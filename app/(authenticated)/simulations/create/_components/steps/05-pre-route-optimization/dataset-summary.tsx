import { Title } from "@/app/_components/typography";
import { Table, TableBody, TableCell, TableRow } from "@/app/_components/ui/table";
import { TSimulationJobDatasetSummary } from "@/types/database";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/app/_components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Separator } from "@/app/_components/ui/separator";

interface IProps {
  data?: TSimulationJobDatasetSummary;
}

export const DatasetSummary = ({ data }: IProps) => {
  const rows = [
    { label: "Total Orders", value: data?.totalOrders.toString() },
    {
      label: "Valid Orders",
      value: data?.validOrders.toString(),
    },
    {
      label: "Ignored Orders",
      value: data?.ignoredOrders.toString(),
    },
    {
      label: "Courier Count",
      value: data?.courierCount.toString(),
    },
    {
      label: "Depot",
      value: data?.depotName,
    },
    {
      label: "Estimated Total Weight (kg)",
      value: data?.estimatedTotalWeightKg.toString(),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="text-left font-medium flex gap-3 items-center cursor-pointer">
          <Title level={3}>Dataset Summary</Title>
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
