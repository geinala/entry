import { MiddlewareResponse } from "@/lib/request";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@clerk/backend";
import env from "@/common/config/environtment";

export const authMiddleware = async (req: NextRequest): Promise<MiddlewareResponse> => {
  const token = req.headers.get("Authorization");

  if (!token) {
    return {
      pass: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  const tokenValue = token.replace("Bearer ", "");

  try {
    await verifyToken(tokenValue, {
      secretKey: env.CLERK_SECRET_KEY || "",
    });

    return {
      pass: true,
      response: NextResponse.json({ message: "Authorized" }, { status: 200 }),
    };
  } catch {
    return {
      pass: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
};
