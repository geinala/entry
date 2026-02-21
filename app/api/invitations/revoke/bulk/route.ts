import { NextRequest } from "next/server";
import { handleAuthenticatedRequest } from "@/lib/request";
import { revokeInvitationController } from "@/server/invitation/invitation.controller";

// POST /invitations/revoke/bulk
export const POST = async (request: NextRequest) => {
  return handleAuthenticatedRequest({
    request,
    callback: revokeInvitationController,
  });
};
