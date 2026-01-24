import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { ItemMedia } from "@/app/_components/ui/item";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Download, FileText } from "lucide-react";

interface ActivityLog {
  id: string;
  date: string;
  activity: string;
  description: string;
}

const ActivityIndicator = ({ color = "blue" }: { color?: string }) => (
  <div className={`h-5 w-5 rounded-full bg-${color}-500/20 flex items-center justify-center`}>
    <div className={`h-2.5 w-2.5 rounded-full bg-${color}-500`} />
  </div>
);

const ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "1",
    date: "2024-06-15 10:30 AM",
    activity: "Simulation Started",
    description: "User initiated a new simulation for route optimization.",
  },
  {
    id: "2",
    date: "2024-06-15 11:45 AM",
    activity: "Data Processed",
    description: "System processed the route optimization data.",
  },
];

export default function LogTable() {
  return (
    <Card className="gap-2">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ItemMedia variant={"icon"} className="bg-blue-100 border-0 h-full size-10">
              <FileText className="text-blue-500 w-full h-full" />
            </ItemMedia>
            <div>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>List of recent simulation activities.</CardDescription>
            </div>
          </div>
          <Button variant={"outline"} size={"sm"}>
            <Download className="w-4 h-4" />
            Export Log
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-background border-none">
              <TableHead className="pl-6">Date</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ACTIVITY_LOGS.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="pl-6">{log.date}</TableCell>
                <TableCell className="flex items-center gap-3">
                  <ActivityIndicator />
                  {log.activity}
                </TableCell>
                <TableCell>{log.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
