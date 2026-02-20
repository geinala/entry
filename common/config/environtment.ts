type Env = {
  NODE_ENV: "development" | "production" | "test";
  NEXT_PUBLIC_NODE_TZ: string;
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_APP_URL: string;
  CLERK_JWT_KEY: string;
  CLERK_SIGN_IN_FORCE_REDIRECT_URL: string;
  CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: string;
  DATABASE_URL: string;
  TOMTOM_API_KEY: string;
  BACKEND_API_URL: string;
  API_KEY: string;
};

const env: Env = {
  NODE_ENV: (process.env.NODE_ENV as Env["NODE_ENV"]) || "development",
  NEXT_PUBLIC_NODE_TZ: process.env.NEXT_PUBLIC_NODE_TZ!,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL!,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
  CLERK_JWT_KEY: process.env.CLERK_JWT_KEY!,
  CLERK_SIGN_IN_FORCE_REDIRECT_URL: process.env.CLERK_SIGN_IN_FORCE_REDIRECT_URL!,
  CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: process.env.CLERK_SIGN_IN_FALLBACK_REDIRECT_URL!,
  DATABASE_URL: process.env.DATABASE_URL!,
  TOMTOM_API_KEY: process.env.TOMTOM_API_KEY!,
  BACKEND_API_URL: process.env.BACKEND_API_URL!,
  API_KEY: process.env.API_KEY!,
};

export const validateEnv = (): void => {
  const requiredVars: (keyof Env)[] = [
    "NODE_ENV",
    "NEXT_PUBLIC_NODE_TZ",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
    "NEXT_PUBLIC_API_URL",
    "NEXT_PUBLIC_APP_URL",
    "CLERK_JWT_KEY",
    "CLERK_SIGN_IN_FORCE_REDIRECT_URL",
    "CLERK_SIGN_IN_FALLBACK_REDIRECT_URL",
    "DATABASE_URL",
    "TOMTOM_API_KEY",
    "BACKEND_API_URL",
    "API_KEY",
  ];

  const missingVars = requiredVars.filter((key) => !env[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.map((v) => `  - ${v}`).join("\n")}`,
    );
  }
};

export default env;
