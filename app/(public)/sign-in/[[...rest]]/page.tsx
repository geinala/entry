"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
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
