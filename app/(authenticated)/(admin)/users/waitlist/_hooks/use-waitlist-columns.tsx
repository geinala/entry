"use client";

import { convertUtcToLocalTime } from "@/lib/utils";
import { TWaitlistEntry } from "@/types/database";
import { ColumnDef } from "@tanstack/react-table";
import { WaitlistStatusBadge } from "../_components/waitlist-status.badge";
import { toast } from "sonner";
import { Send, XCircle, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { useSendInvitationMutation, useUpdateWaitlistStatusMutation } from "./use-mutations";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { useCallback, useMemo, useState } from "react";

interface IUseWaitlistColumnsReturn {
  columns: ColumnDef<TWaitlistEntry>[];
  selectedIds: number[];
  isLoading: boolean;
  sendBulkInvitations: () => Promise<void>;
  bulkUpdateWaitlistStatus: () => Promise<void>;
  clearSelection: () => void;
  isDeniable: boolean;
}

export const useWaitlistColumns = (data?: TWaitlistEntry[]): IUseWaitlistColumnsReturn => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { mutateAsync, isPending: isSendMutationPending } = useSendInvitationMutation();
  const { mutateAsync: bulkDeniedWaitlist, isPending: isBulkDeniedWaitlistPending } =
    useUpdateWaitlistStatusMutation();

  const isAnyPending = isSendMutationPending || isBulkDeniedWaitlistPending;

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
      toast.error(`Failed to send invitations. Please try again. ${errorMessage}`);
    }
  };

  const updateWaitlistStatus = async () => {
    try {
      await bulkDeniedWaitlist({ waitlistIds: selectedIds, status: "denied" });
      setSelectedIds([]); // Clear selection only on success
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update status";
      toast.error(`Failed to update status. Please try again. ${errorMessage}`);
    }
  };

  /**
   * Clear all selected rows
   */
  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  /**
   * Check if any selected row can be denied
   * Deniable status: "pending", "expired", or "revoked"
   */
  const isDeniable = useMemo(() => {
    if (selectedIds.length === 0 || !data) return false;
    return selectedIds.some((id) => {
      const entry = data.find((item) => item.id === id);
      return (
        entry &&
        (entry.status === "pending" || entry.status === "expired" || entry.status === "revoked")
      );
    });
  }, [selectedIds, data]);

  /**
   * Helper function to get available actions for a status
   * Returns array of action objects with type and handler
   */
  const getActionsForStatus = useCallback(
    (entry: TWaitlistEntry) => {
      const actions: Array<{
        id: string;
        label: string;
        icon: React.ReactNode;
        action: () => void;
        variant: "default" | "destructive" | "ghost";
        className?: string;
      }> = [];

      switch (entry.status) {
        case "pending":
          actions.push({
            id: "send",
            label: "Invite",
            icon: <Send className="w-4 h-4" />,
            action: () => mutateAsync({ waitlistIds: [entry.id] }),
            variant: "ghost",
            className: "text-green-600 hover:text-green-700",
          });
          actions.push({
            id: "deny",
            label: "Deny",
            icon: <XCircle className="w-4 h-4" />,
            action: () => bulkDeniedWaitlist({ waitlistIds: [entry.id], status: "denied" }),
            variant: "ghost",
            className: "text-red-600 hover:text-red-700",
          });
          break;

        case "denied":
          actions.push({
            id: "reinvite",
            label: "Reinvite",
            icon: <RotateCcw className="w-4 h-4" />,
            action: () => toast.warning("This feature is coming soon!"),
            variant: "ghost",
            className: "text-blue-600 hover:text-blue-700",
          });
          break;

        case "invited":
          // Invited: revoke dan reinvite
          actions.push({
            id: "revoke",
            label: "Revoke",
            icon: <Trash2 className="w-4 h-4" />,
            action: () => toast.warning("This feature is coming soon!"),
            variant: "ghost",
            className: "text-red-600 hover:text-red-700",
          });
          actions.push({
            id: "reinvite",
            label: "Reinvite",
            icon: <RotateCcw className="w-4 h-4" />,
            action: () => toast.warning("This feature is coming soon!"),
            variant: "ghost",
            className: "text-blue-600 hover:text-blue-700",
          });
          break;

        case "revoked":
          // Revoked: reinvite dan tolak
          actions.push({
            id: "reinvite",
            label: "Reinvite",
            icon: <RotateCcw className="w-4 h-4" />,
            action: () => toast.warning("This feature is coming soon!"),
            variant: "ghost",
            className: "text-blue-600 hover:text-blue-700",
          });
          actions.push({
            id: "deny",
            label: "Deny",
            icon: <XCircle className="w-4 h-4" />,
            action: () => bulkDeniedWaitlist({ waitlistIds: [entry.id], status: "denied" }),
            variant: "ghost",
            className: "text-red-600 hover:text-red-700",
          });
          break;

        case "expired":
          // Expired: reinvite dan tolak
          actions.push({
            id: "reinvite",
            label: "Reinvite",
            icon: <RotateCcw className="w-4 h-4" />,
            action: () => toast.warning("This feature is coming soon!"),
            variant: "ghost",
            className: "text-blue-600 hover:text-blue-700",
          });
          actions.push({
            id: "deny",
            label: "Deny",
            icon: <XCircle className="w-4 h-4" />,
            action: () => bulkDeniedWaitlist({ waitlistIds: [entry.id], status: "denied" }),
            variant: "ghost",
            className: "text-red-600 hover:text-red-700",
          });
          break;

        case "failed":
          actions.push({
            id: "reinvite",
            label: "Reinvite",
            icon: <RotateCcw className="w-4 h-4" />,
            action: () => toast.warning("This feature is coming soon!"),
            variant: "ghost",
            className: "text-blue-600 hover:text-blue-700",
          });
          actions.push({
            id: "deny",
            label: "Deny",
            icon: <XCircle className="w-4 h-4" />,
            action: () => bulkDeniedWaitlist({ waitlistIds: [entry.id], status: "denied" }),
            variant: "ghost",
            className: "text-red-600 hover:text-red-700",
          });
          break;
      }

      return actions;
    },
    [mutateAsync, bulkDeniedWaitlist],
  );

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
        accessorKey: "invitedAt",
        header: "Invited At",
        cell: ({ row }) => {
          const entry = row.original;
          return entry.invitedAt
            ? convertUtcToLocalTime({ utcDateStr: entry.invitedAt.toString(), format: "PPpp" })
            : "-";
        },
      },
      {
        accessorKey: "expiredAt",
        header: "Expired At",
        cell: ({ row }) => {
          const entry = row.original;
          return entry.expiredAt
            ? convertUtcToLocalTime({ utcDateStr: entry.expiredAt.toString(), format: "PPpp" })
            : "-";
        },
      },
      {
        accessorKey: "confirmedAt",
        header: "Confirmed At",
        cell: ({ row }) => {
          const entry = row.original;
          return entry.confirmedAt
            ? convertUtcToLocalTime({ utcDateStr: entry.confirmedAt.toString(), format: "PPpp" })
            : "-";
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
          const actions = getActionsForStatus(row.original);

          if (actions.length === 0) {
            return null;
          }

          return (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {actions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant}
                  size="sm"
                  className={action.className}
                  onClick={() => action.action()}
                  disabled={isAnyPending}
                  isLoading={isAnyPending}
                >
                  {action.icon}
                  <span className="hidden sm:inline ml-1">{action.label}</span>
                </Button>
              ))}
            </div>
          );
        },
      },
    ],
    [handleSelectRow, selectedIds, isAnyPending, getActionsForStatus],
  );

  return {
    columns,
    selectedIds,
    isLoading: isAnyPending,
    bulkUpdateWaitlistStatus: updateWaitlistStatus,
    sendBulkInvitations,
    clearSelection,
    isDeniable,
  };
};
