"use client";

import { Badge } from "@/app/_components/ui/badge";
import { TWaitlistStatus } from "@/types/database";

interface IWaitlistStatusBadgeProps {
  status: TWaitlistStatus;
}

/**
 * Configuration for each waitlist status
 * This is exhaustive and must cover all TWaitlistStatus enum values
 */
const STATUS_CONFIG = {
  pending: { color: "bg-amber-100 text-amber-800", label: "Pending" },
  confirmed: { color: "bg-green-100 text-green-800", label: "Confirmed" },
  rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
  invited: { color: "bg-blue-100 text-blue-800", label: "Invited" },
  expired: { color: "bg-gray-100 text-gray-800", label: "Expired" },
  sending: { color: "bg-orange-100 text-orange-800", label: "Sending" },
} as const satisfies Record<TWaitlistStatus, { color: string; label: string }>;

type StatusConfig = (typeof STATUS_CONFIG)[TWaitlistStatus];

/**
 * Safely retrieve status configuration with exhaustiveness guarantee
 */
const getStatusConfig = (status: TWaitlistStatus): StatusConfig => {
  // TypeScript ensures this is safe due to 'as const satisfies' constraint
  return STATUS_CONFIG[status];
};

export const WaitlistStatusBadge = ({ status }: IWaitlistStatusBadgeProps) => {
  const config = getStatusConfig(status);

  return <Badge className={config.color}>{config.label}</Badge>;
};
