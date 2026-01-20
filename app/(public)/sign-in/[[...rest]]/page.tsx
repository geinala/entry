"use client";

import { SignIn, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Page() {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut();
  }, [signOut]);

  return (
    <main className="w-dvw h-dvh flex justify-center items-center">
      <SignIn
        path="/sign-in"
        afterSignOutUrl={"/sign-in"}
        fallbackRedirectUrl={"/onboarding"}
        forceRedirectUrl={"/onboarding"}
        signUpForceRedirectUrl={"/onboarding"}
        appearance={{
          elements: {
            footerAction: { display: "none" },
          },
        }}
      />
    </main>
  );
}
