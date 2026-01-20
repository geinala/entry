import { authMiddleware } from "@/middleware/auth.middleware";
import { NextRequest, NextResponse } from "next/server";

export interface MiddlewareResponse {
  pass: boolean;
  response: NextResponse;
}

export interface MiddlewareRequest {
  request: NextRequest;
  callback: (req: NextRequest) => Promise<NextResponse>;
  middleware?: Array<Promise<MiddlewareResponse>>;
}

export const handleRequest = async ({
  request,
  callback,
  middleware,
}: MiddlewareRequest): Promise<NextResponse> => {
  if (middleware) {
    for (const middlewareFunction of middleware) {
      const result: MiddlewareResponse = await middlewareFunction;

      if (!result.pass) {
        return result.response;
      }
    }
  }

  const finalResult = callback(request);

  return finalResult;
};

export const handleAuthenticatedRequest = async ({
  request,
  callback,
  middleware,
}: MiddlewareRequest): Promise<NextResponse> => {
  const authResult = await authMiddleware(request);

  if (authResult) {
    if (!authResult.pass) {
      return authResult.response;
    }
  }

  if (middleware) {
    for (const middlewareFunction of middleware) {
      const result: MiddlewareResponse = await middlewareFunction;

      if (!result.pass) {
        return result.response;
      }
    }
  }

  const finalResult = callback(request);

  return finalResult;
};
