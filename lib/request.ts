import { authMiddleware } from "@/middleware/auth.middleware";
import { NextRequest, NextResponse } from "next/server";

export interface MiddlewareResponse<T = unknown> {
  pass: boolean;
  response: NextResponse;
  data?: T;
}

export type RequestCallback<T = unknown> = (req: NextRequest, context?: T) => Promise<NextResponse>;

export interface MiddlewareRequest<T = unknown> {
  request: NextRequest;
  callback: RequestCallback<T>;
  middleware?: Array<Promise<MiddlewareResponse<T>>>;
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

  const finalResult = await callback(request);

  return finalResult;
};

export const handleAuthenticatedRequest = async ({
  request,
  callback,
  middleware,
}: MiddlewareRequest<string>): Promise<NextResponse> => {
  const authResult: MiddlewareResponse<string> = await authMiddleware(request);

  if (authResult) {
    if (!authResult.pass) {
      return authResult.response;
    }
  }

  return handleRequest({
    request,
    middleware,
    callback: async (req) => {
      return callback(req, authResult.data);
    },
  });
};
