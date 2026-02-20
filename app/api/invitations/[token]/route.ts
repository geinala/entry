import "server-only";

import { acceptInvitationController } from "@/server/invitation/invitation.controller";
import { NextRequest } from "next/server";

// GET: /invitations/[token]
export const POST = async (_: NextRequest, context: { params: Promise<{ token: string }> }) => {
  const { token } = await context.params;

  return acceptInvitationController(token);
};
