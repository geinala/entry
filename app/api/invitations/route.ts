import { handleAuthenticatedRequest } from "@/lib/request";
import { sendInvitationController } from "@/server/invitation/invitation.controller";
import { NextRequest } from "next/server";

// POST /invitations
export const POST = async (request: NextRequest) => {
  return handleAuthenticatedRequest({
    request,
    callback: sendInvitationController,
  });
};
