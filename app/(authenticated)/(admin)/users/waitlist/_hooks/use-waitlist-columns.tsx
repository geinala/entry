"use client";

import { convertUtcToLocalTime } from "@/lib/utils";
import { TWaitlistEntry } from "@/types/database";
import { ColumnDef } from "@tanstack/react-table";
import { WaitlistStatusBadge } from "../_components/waitlist-status.badge";
import { toast } from "sonner";
import { Send, XCircle, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  useRevokeInvitationMutation,
  useSendInvitationMutation,
  useUpdateWaitlistStatusMutation,
} from "./use-mutations";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { useCallback, useMemo, useState, useEffect } from "react";
import { WaitlistActionToast } from "../_components/waitlist-action.toast";
import { useUserContext } from "@/app/_contexts/user.context";
import { clientCheckPermissions } from "@/lib/permission";
import { PERMISSIONS } from "@/common/constants/permissions/permissions";

interface IUseWaitlistColumnsReturn {
  columns: ColumnDef<TWaitlistEntry>[];
  clearSelection: () => void;
}

export const useWaitlistColumns = (_data?: TWaitlistEntry[]): IUseWaitlistColumnsReturn => {
  const { permissions } = useUserContext();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { mutateAsync: sendInvitation, isPending: isSendMutationPending } =
    useSendInvitationMutation();
  const { mutateAsync: updateStatusMutation, isPending: isUpdateStatusMutationPending } =
    useUpdateWaitlistStatusMutation();
  const { mutateAsync: revokeInvitation, isPending: isRevokeInvitationPending } =
    useRevokeInvitationMutation();

  const isAnyPending =
    isSendMutationPending || isUpdateStatusMutationPending || isRevokeInvitationPending;

  /**
   * Memoized callback to handle row selection changes
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
  const sendBulkInvitations = useCallback(async () => {
    if (!permissions || !clientCheckPermissions(permissions, [PERMISSIONS.WAITLIST_INVITE])) {
      toast.error("You don't have permission to send invitations");
      return;
    }

    if (selectedIds.length === 0) {
      toast.error("No rows selected");
      return;
    }

    await sendInvitation({ waitlistIds: selectedIds });
    setSelectedIds([]);
  }, [selectedIds, sendInvitation, permissions]);

  /**
   * Bulk deny selected waitlist entries
   */
  const denyBulkEntries = useCallback(async () => {
    if (!permissions || !clientCheckPermissions(permissions, [PERMISSIONS.WAITLIST_DENY])) {
      toast.error("You don't have permission to deny entries");
      return;
    }

    if (selectedIds.length === 0) {
      toast.error("No rows selected");
      return;
    }

    await updateStatusMutation({ waitlistIds: selectedIds, status: "denied" });
    setSelectedIds([]);
  }, [selectedIds, updateStatusMutation, permissions]);

  /**
   * Bulk revoke selected waitlist entries
   */
  const revokeBulkEntries = useCallback(async () => {
    if (!permissions || !clientCheckPermissions(permissions, [PERMISSIONS.WAITLIST_REVOKE])) {
      toast.error("You don't have permission to revoke invitations");
      return;
    }

    if (selectedIds.length === 0) {
      toast.error("No rows selected");
      return;
    }

    await revokeInvitation({ waitlistIds: selectedIds });
    setSelectedIds([]);
  }, [selectedIds, revokeInvitation, permissions]);

  /**
   * Clear all selected rows
   */
  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

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
          if (permissions && clientCheckPermissions(permissions, [PERMISSIONS.WAITLIST_INVITE])) {
            actions.push({
              id: "send",
              label: "Invite",
              icon: <Send className="w-4 h-4" />,
              action: () => sendInvitation({ waitlistIds: [entry.id] }),
              variant: "ghost",
              className: "text-green-600 hover:text-green-700",
            });
          }
          if (permissions && clientCheckPermissions(permissions, [PERMISSIONS.WAITLIST_DENY])) {
            actions.push({
              id: "deny",
              label: "Deny",
              icon: <XCircle className="w-4 h-4" />,
              action: () => updateStatusMutation({ waitlistIds: [entry.id], status: "denied" }),
              variant: "ghost",
              className: "text-red-600 hover:text-red-700",
            });
          }
          break;

        case "denied":
          if (permissions && clientCheckPermissions(permissions, [PERMISSIONS.WAITLIST_INVITE])) {
            actions.push({
              id: "reinvite",
              label: "Reinvite",
              icon: <RotateCcw className="w-4 h-4" />,
              action: () => sendInvitation({ waitlistIds: [entry.id] }),
              variant: "ghost",
              className: "text-emerald-600 hover:text-emerald-700",
            });
          }
          break;

        case "invited":
          if (permissions && clientCheckPermissions(permissions, [PERMISSIONS.WAITLIST_REVOKE])) {
            actions.push({
              id: "revoke",
              label: "Revoke",
              icon: <Trash2 className="w-4 h-4" />,
              action: () => revokeInvitation({ waitlistIds: [entry.id] }),
              variant: "ghost",
              className: "text-red-600 hover:text-red-700",
            });
          }
          if (permissions && clientCheckPermissions(permissions, [PERMISSIONS.WAITLIST_INVITE])) {
            actions.push({
              id: "reinvite",
              label: "Reinvite",
              icon: <RotateCcw className="w-4 h-4" />,
              action: () => sendInvitation({ waitlistIds: [entry.id] }),
              variant: "ghost",
              className: "text-emerald-600 hover:text-emerald-700",
            });
          }
          break;

        case "revoked":
          if (permissions && clientCheckPermissions(permissions, [PERMISSIONS.WAITLIST_INVITE])) {
            actions.push({
              id: "reinvite",
              label: "Reinvite",
              icon: <RotateCcw className="w-4 h-4" />,
              action: () => sendInvitation({ waitlistIds: [entry.id] }),
              variant: "ghost",
              className: "text-emerald-600 hover:text-emerald-700",
            });
          }
          break;

        case "expired":
          if (permissions && clientCheckPermissions(permissions, [PERMISSIONS.WAITLIST_INVITE])) {
            actions.push({
              id: "reinvite",
              label: "Reinvite",
              icon: <RotateCcw className="w-4 h-4" />,
              action: () => sendInvitation({ waitlistIds: [entry.id] }),
              variant: "ghost",
              className: "text-emerald-600 hover:text-emerald-700",
            });
          }
          break;

        case "failed":
          if (permissions && clientCheckPermissions(permissions, [PERMISSIONS.WAITLIST_INVITE])) {
            actions.push({
              id: "reinvite",
              label: "Reinvite",
              icon: <RotateCcw className="w-4 h-4" />,
              action: () => sendInvitation({ waitlistIds: [entry.id] }),
              variant: "ghost",
              className: "text-emerald-600 hover:text-emerald-700",
            });
          }
          break;
      }

      return actions;
    },
    [sendInvitation, updateStatusMutation, revokeInvitation, permissions],
  );

  /**
   * Show bulk action toast when selection changes
   */
  useEffect(() => {
    if (selectedIds.length > 0) {
      // Determine available actions for selected entries
      const getAvailableActions = () => {
        if (!_data) return new Set<string>();

        const selectedEntries = _data.filter((entry) => selectedIds.includes(entry.id));
        if (selectedEntries.length === 0) return new Set<string>();

        // Get actions for each selected entry using getActionsForStatus
        const actionsPerEntry = selectedEntries.map((entry) => {
          const actions = getActionsForStatus(entry);
          return new Set(actions.map((a) => a.id));
        });

        // Find common actions across all selected entries
        if (actionsPerEntry.length === 1) {
          return actionsPerEntry[0];
        }

        const commonActions = new Set<string>();
        actionsPerEntry[0].forEach((action) => {
          if (actionsPerEntry.every((actions) => actions.has(action))) {
            commonActions.add(action);
          }
        });

        return commonActions;
      };

      const availableActions = getAvailableActions();

      toast(
        <div className="flex flex-row justify-center items-center gap-2">
          {`Selected ${selectedIds.length} entr${selectedIds.length > 1 ? "ies" : "y"}`}
          <WaitlistActionToast
            onClearSelection={clearSelection}
            onDeny={denyBulkEntries}
            onInvite={sendBulkInvitations}
            onRevoke={revokeBulkEntries}
            availableActions={availableActions}
          />
        </div>,
        {
          id: "bulk-actions",
          closeButton: false,
          duration: Infinity,
          richColors: false,
          icon: false,
          className:
            "w-max! p-2! bg-radial-[at_52%_-52%]! from-neutral-900/70! to-neutral-900/95! text-white! inset-shadow-2xs! inset-shadow-white/25! border! border-neutral-800! shadow-xl! text-sm! ring-0!",
          position: "bottom-center",
        },
      );
    } else {
      // Dismiss toast when all selections are cleared
      toast.dismiss("bulk-actions");
    }
  }, [
    selectedIds,
    sendBulkInvitations,
    denyBulkEntries,
    revokeBulkEntries,
    clearSelection,
    _data,
    getActionsForStatus,
  ]);

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
    clearSelection,
  };
};
