import { MiddlewareResponse } from "@/lib/request";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import env from "@/common/config/environtment";

export const authMiddleware = async (req: NextRequest): Promise<MiddlewareResponse<string>> => {
  try {
    const client = await clerkClient();

    const { toAuth } = await client.authenticateRequest(req, {
      jwtKey: env.CLERK_JWT_KEY,
    });

    return {
      pass: true,
      data: toAuth()?.userId as string,
      response: NextResponse.json({ message: "Authorized" }, { status: 200 }),
    };
  } catch {
    return {
      pass: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
};
