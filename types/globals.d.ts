export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      is_eligible?: boolean;
    };
  }
}
