type Env = {
  NODE_ENV: "development" | "production" | "test";
  NEXT_PUBLIC_NODE_TZ: string;
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_APP_URL: string;
  CLERK_SECRET_KEY: string;
  CLERK_JWT_KEY?: string;
  CLERK_SIGN_IN_FORCE_REDIRECT_URL: string;
  CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: string;
  DATABASE_URL: string;
  NEXT_PUBLIC_TOMTOM_API_KEY: string;
  REDIS_URL: string;
};

const env: Env = {
  NODE_ENV: (process.env.NODE_ENV as Env["NODE_ENV"]) || "development",
  NEXT_PUBLIC_NODE_TZ: process.env.NEXT_PUBLIC_NODE_TZ || "UTC",
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL!,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
  CLERK_JWT_KEY: process.env.CLERK_JWT_KEY,
  CLERK_SIGN_IN_FORCE_REDIRECT_URL: process.env.CLERK_SIGN_IN_FORCE_REDIRECT_URL!,
  CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: process.env.CLERK_SIGN_IN_FALLBACK_REDIRECT_URL!,
  DATABASE_URL: process.env.DATABASE_URL!,
  NEXT_PUBLIC_TOMTOM_API_KEY: process.env.NEXT_PUBLIC_TOMTOM_API_KEY!,
  REDIS_URL: process.env.REDIS_URL!,
};

export const validateEnv = (): void => {
  const requiredVars = [
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
    "CLERK_SECRET_KEY",
    "CLERK_SIGN_IN_FORCE_REDIRECT_URL",
    "CLERK_SIGN_IN_FALLBACK_REDIRECT_URL",
    "DATABASE_URL",
    "NEXT_PUBLIC_TOMTOM_API_KEY",
    "REDIS_URL",
  ];

  const missingVars = requiredVars.filter((key) => !env[key as keyof Env]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.map((v) => `  - ${v}`).join("\n")}`,
    );
  }
};

export default env;
