import { MiddlewareResponse } from "@/lib/request";
import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/auth.service";

export type AuthMiddlewareData = {
  clerkUserId: string;
  sessionId: string;
};

export const authMiddleware = async (
  req: NextRequest,
): Promise<MiddlewareResponse<AuthMiddlewareData>> => {
  try {
    const authData = await authService.authenticateRequest(req);

    if (!authData) {
      return {
        pass: false,
        response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
      };
    }

    const { sessionId, userId } = authData;

    if (!userId) {
      return {
        pass: false,
        response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
      };
    }

    return {
      pass: true,
      data: { clerkUserId: userId, sessionId },
      response: NextResponse.json({ message: "Authorized" }, { status: 200 }),
    };
  } catch {
    return {
      pass: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
};
