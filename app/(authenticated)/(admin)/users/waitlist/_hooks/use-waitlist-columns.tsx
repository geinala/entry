"use client";

import { convertUtcToLocalTime } from "@/lib/utils";
import { TWaitlistEntry } from "@/types/database";
import { ColumnDef } from "@tanstack/react-table";
import { WaitlistStatusBadge } from "../_components/waitlist-status.badge";
import { toast } from "sonner";
import { Send, XCircle } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { useSendInvitationMutation } from "./use-mutations";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { useCallback, useMemo, useState } from "react";

interface IUseWaitlistColumnsReturn {
  columns: ColumnDef<TWaitlistEntry>[];
  selectedIds: number[];
  isSendingInvitations: boolean;
  sendBulkInvitations: () => Promise<void>;
  clearSelection: () => void;
}

export const useWaitlistColumns = (): IUseWaitlistColumnsReturn => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { mutateAsync, isPending: isSendMutationPending } = useSendInvitationMutation();

  /**
   * Memoized callback to handle row selection changes
   * Prevents unnecessary table re-renders from function recreation
   */
  const handleSelectRow = useCallback((id: number, selected: boolean) => {
    setSelectedIds((prev) => {
      if (selected) {
        return [...prev, id];
      } else {
        return prev.filter((selectedId) => selectedId !== id);
      }
    });
  }, []);

  /**
   * Send bulk invitations to selected waitlist entries
   * Preserves selection state on error for retry capability
   */
  const sendBulkInvitations = async () => {
    if (selectedIds.length === 0) {
      toast.error("No rows selected");
      return;
    }

    try {
      await mutateAsync({ waitlistIds: selectedIds });
      setSelectedIds([]); // Clear selection only on success
    } catch (error) {
      // Preserve selectedIds so user can retry without re-selecting
      const errorMessage = error instanceof Error ? error.message : "Failed to send invitations";
      console.error("[SendBulkInvitations] Error:", errorMessage);
      toast.error(`Failed to send invitations. Please try again. ${errorMessage}`);
    }
  };

  /**
   * Clear all selected rows
   */
  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  /**
   * Memoized column definitions to prevent table re-renders
   * Recreate only when mutation state or handlers change
   */
  const columns: ColumnDef<TWaitlistEntry>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getRowModel().rows.length > 0 &&
              selectedIds.length === table.getRowModel().rows.length
            }
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
              if (value) {
                const allIds = table.getRowModel().rows.map((row) => row.original.id);
                setSelectedIds(allIds);
              } else {
                setSelectedIds([]);
              }
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedIds.includes(row.original.id)}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
              handleSelectRow(row.original.id, !!value);
            }}
            aria-label="Select row"
          />
        ),
      },
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
        cell: ({ row }) => {
          if (row.original.status !== "pending") {
            return null;
          }

          return (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant={"ghost"}
                size={"sm"}
                className="text-green-600 hover:text-green-700"
                onClick={() => mutateAsync({ waitlistIds: [row.original.id] })}
                disabled={isSendMutationPending}
                isLoading={isSendMutationPending}
              >
                <Send /> Send Invitation
              </Button>
              <Button
                variant={"ghost"}
                size={"sm"}
                onClick={() => toast.warning("Coming Soon")}
                className="ml-2 text-red-600 hover:text-red-700"
                disabled={isSendMutationPending}
              >
                <XCircle /> Reject
              </Button>
            </div>
          );
        },
      },
    ],
    [handleSelectRow, isSendMutationPending, mutateAsync, selectedIds],
  );

  return {
    columns,
    selectedIds,
    isSendingInvitations: isSendMutationPending,
    sendBulkInvitations,
    clearSelection,
  };
};
