"use client";

import { convertUtcToLocalTime } from "@/lib/utils";
import { TWaitlistEntry } from "@/types/database";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { WaitlistStatusBadge } from "../_components/waitlist-status.badge";
import { toast } from "sonner";
import { Send, XCircle } from "lucide-react";
import { Button } from "@/app/_components/ui/button";

export const useWaitlistColumns = () => {
  return useMemo<ColumnDef<TWaitlistEntry>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Name",
        cell: ({ row }) => {
          const entry = row.original;
          return `${entry.firstName} ${entry.lastName}`;
        },
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "createdAt",
        header: "Registered At",
        cell: ({ row }) => {
          const entry = row.original;
          return convertUtcToLocalTime({ utcDateStr: entry.createdAt.toString(), format: "PPpp" });
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const entry = row.original;
          return <WaitlistStatusBadge status={entry.status} />;
        },
      },
      {
        id: "actions",
        accessorKey: "actions",
        header: "",
        cell: () => {
          return (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant={"ghost"}
                size={"sm"}
                className="text-green-600 hover:text-green-700"
                onClick={() => toast.warning("Coming Soon")}
              >
                <Send /> Send Invitation
              </Button>
              <Button
                variant={"ghost"}
                size={"sm"}
                onClick={() => toast.warning("Coming Soon")}
                className="ml-2 text-red-600 hover:text-red-700"
              >
                <XCircle /> Reject
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );
};
