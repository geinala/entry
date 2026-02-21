import "server-only";

import env from "@/common/config/environtment";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export const clerkService = {
  revokeSession: async (sessionId: string) => {
    const client = await clerkClient();

    await client.sessions.revokeSession(sessionId);
  },

  updateUserMetadata: async (clerkUserId: string, metadata: Record<string, unknown>) => {
    const client = await clerkClient();

    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: metadata,
    });
  },

  authenticateRequest: async (req: NextRequest) => {
    const client = await clerkClient();

    const { toAuth } = await client.authenticateRequest(req, {
      jwtKey: env.CLERK_JWT_KEY,
    });

    return toAuth();
  },

  createClerkUser: async ({
    email,
    firstName,
    lastName,
  }: {
    email: string;
    firstName?: string;
    lastName?: string;
  }) => {
    const client = await clerkClient();

    const user = await client.users.createUser({
      emailAddress: [email],
      firstName,
      lastName,
      publicMetadata: {
        isOnboarded: true,
      },
    });

    return user;
  },
};
