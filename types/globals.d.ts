export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      isEligible?: boolean;
    };
  }
}
