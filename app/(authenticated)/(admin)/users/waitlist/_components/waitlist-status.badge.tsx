"use client";

import { Badge } from "@/app/_components/ui/badge";
import { TWaitlistStatus } from "@/types/database";

interface IWaitlistStatusBadgeProps {
  status: TWaitlistStatus;
}

const STATUS_CONFIG: Record<TWaitlistStatus, { color: string; label: TWaitlistStatus }> = {
  pending: { color: "bg-amber-100 text-amber-800", label: "pending" },
  confirmed: { color: "bg-green-100 text-green-800", label: "confirmed" },
  rejected: { color: "bg-red-100 text-red-800", label: "rejected" },
  invited: { color: "bg-blue-100 text-blue-800", label: "invited" },
  expired: { color: "bg-gray-100 text-gray-800", label: "expired" },
};

export const WaitlistStatusBadge = ({ status }: IWaitlistStatusBadgeProps) => {
  const config = STATUS_CONFIG[status] || {
    color: "bg-gray-500",
    label: status,
  };

  return <Badge className={config.color}>{config.label}</Badge>;
};
