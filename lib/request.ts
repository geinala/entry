import { authMiddleware, AuthMiddlewareData } from "@/middleware/auth.middleware";
import { NextRequest, NextResponse } from "next/server";

export interface MiddlewareResponseBase {
  pass: boolean;
  response: NextResponse;
}

export interface MiddlewareResponseWithData<T> extends MiddlewareResponseBase {
  pass: true;
  data: T;
}

export interface MiddlewareResponseWithoutData extends MiddlewareResponseBase {
  pass: false;
}

export type MiddlewareResponse<T> = MiddlewareResponseWithData<T> | MiddlewareResponseWithoutData;

export type RequestCallback<T> = T extends undefined
  ? (req: NextRequest) => Promise<NextResponse>
  : (req: NextRequest, context: T) => Promise<NextResponse>;

// Middleware function type
export type MiddlewareFunction<T = unknown> = (req: NextRequest) => Promise<MiddlewareResponse<T>>;

export interface MiddlewareRequest<T = undefined> {
  request: NextRequest;
  callback: RequestCallback<T>;
  middleware?: MiddlewareFunction<unknown>[];
}

export async function handleRequest(config: {
  request: NextRequest;
  callback: (req: NextRequest) => Promise<NextResponse>;
  middleware?: MiddlewareFunction<unknown>[];
}): Promise<NextResponse>;

export async function handleRequest<T>(config: {
  request: NextRequest;
  callback: (req: NextRequest, context: T) => Promise<NextResponse>;
  middleware?: MiddlewareFunction<unknown>[];
  context: T;
}): Promise<NextResponse>;

export async function handleRequest<T = undefined>(config: {
  request: NextRequest;
  callback: RequestCallback<T>;
  middleware?: MiddlewareFunction<unknown>[];
  context?: T;
}): Promise<NextResponse> {
  const { request, callback, middleware } = config;

  if (middleware) {
    for (const middlewareFunction of middleware) {
      const result = await middlewareFunction(request);
      if (!result.pass) {
        return result.response;
      }
    }
  }

  if ("context" in config && config.context !== undefined) {
    return (callback as (req: NextRequest, ctx: T) => Promise<NextResponse>)(
      request,
      config.context,
    );
  }

  return (callback as (req: NextRequest) => Promise<NextResponse>)(request);
}

export const handleAuthenticatedRequest = async ({
  request,
  callback,
  middleware = [],
}: MiddlewareRequest<AuthMiddlewareData>): Promise<NextResponse> => {
  const authResult = await authMiddleware(request);

  if (!authResult.pass) {
    return authResult.response;
  }

  const authData = authResult.data;

  if (middleware.length > 0) {
    for (const middlewareFunction of middleware) {
      const result = await middlewareFunction(request);
      if (!result.pass) {
        return result.response;
      }
    }
  }

  return callback(request, authData);
};
