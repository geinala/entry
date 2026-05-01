type Env = {
  DATABASE_URL: string;
  NODE_ENV: "development" | "production" | "test";
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_NODE_TZ: string;
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
  CLERK_SECRET_KEY: string;
  CLERK_JWT_KEY: string;
  CLERK_SIGN_IN_FORCE_REDIRECT_URL: string;
  CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: string;
  NEXT_PUBLIC_TOMTOM_API_KEY: string;
  NEXT_PUBLIC_TOMTOM_API_URL: string;
  BACKEND_API_URL: string;
  API_KEY: string;
  MINIO_ENDPOINT: string;
  MINIO_PORT: number;
  MINIO_USE_SSL: boolean;
  MINIO_ACCESS_KEY: string;
  MINIO_SECRET_KEY: string;
  MINIO_BUCKET_NAME: string;
  TZ?: string;
};

const env: Env = {
  NODE_ENV: process.env.NODE_ENV as Env["NODE_ENV"],
  NEXT_PUBLIC_NODE_TZ: process.env.NEXT_PUBLIC_NODE_TZ!,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL!,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
  CLERK_JWT_KEY: process.env.CLERK_JWT_KEY!,
  CLERK_SIGN_IN_FORCE_REDIRECT_URL: process.env.CLERK_SIGN_IN_FORCE_REDIRECT_URL!,
  CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: process.env.CLERK_SIGN_IN_FALLBACK_REDIRECT_URL!,
  DATABASE_URL: process.env.DATABASE_URL!,
  NEXT_PUBLIC_TOMTOM_API_KEY: process.env.NEXT_PUBLIC_TOMTOM_API_KEY!,
  BACKEND_API_URL: process.env.BACKEND_API_URL!,
  API_KEY: process.env.API_KEY!,
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT!,
  MINIO_PORT: parseInt(process.env.MINIO_PORT!, 10),
  MINIO_USE_SSL: Boolean(process.env.MINIO_USE_SSL === "true"),
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY!,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY!,
  MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME!,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
  NEXT_PUBLIC_TOMTOM_API_URL: process.env.NEXT_PUBLIC_TOMTOM_API_URL!,
  TZ: process.env.TZ,
};

export const validateEnv = (): void => {
  const requiredVars: (keyof Env)[] = [
    "DATABASE_URL",
    "NODE_ENV",
    "NEXT_PUBLIC_API_URL",
    "NEXT_PUBLIC_NODE_TZ",
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
    "CLERK_JWT_KEY",
    "CLERK_SIGN_IN_FORCE_REDIRECT_URL",
    "CLERK_SIGN_IN_FALLBACK_REDIRECT_URL",
    "NEXT_PUBLIC_TOMTOM_API_KEY",
    "BACKEND_API_URL",
    "API_KEY",
    "MINIO_ENDPOINT",
    "MINIO_PORT",
    "MINIO_USE_SSL",
    "MINIO_ACCESS_KEY",
    "MINIO_SECRET_KEY",
    "MINIO_BUCKET_NAME",
    "CLERK_SECRET_KEY",
    "NEXT_PUBLIC_TOMTOM_API_URL",
  ];

  const missingVars = requiredVars.filter((key) => {
    const value = env[key];

    if (typeof value === "string") {
      return value.trim() === "";
    }

    return value === undefined || value === null;
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.map((v) => `  - ${v}`).join("\n")}`,
    );
  }
};

export default env;
