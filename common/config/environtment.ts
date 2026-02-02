export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  NEXT_BASE_URL: process.env.NEXT_BASE_URL || "http://localhost:3000",
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLERK_JWT_KEY: process.env.CLERK_JWT_KEY,
  CLERK_SIGN_IN_FORCE_REDIRECT_URL: process.env.CLERK_SIGN_IN_FORCE_REDIRECT_URL,
  CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: process.env.CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_TOMTOM_API_KEY: process.env.NEXT_PUBLIC_TOMTOM_API_KEY,
} as const;

export type Env = typeof env;

export const validateEnv = (): void => {
  const requiredVars = [
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
    "CLERK_SECRET_KEY",
    "CLERK_SIGN_IN_FORCE_REDIRECT_URL",
    "CLERK_SIGN_IN_FALLBACK_REDIRECT_URL",
    "DATABASE_URL",
    "NEXT_PUBLIC_TOMTOM_API_KEY",
  ];

  const missingVars = requiredVars.filter((key) => !process.env?.[key]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }
};

export default env;
