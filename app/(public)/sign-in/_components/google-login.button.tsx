"use client";

import { Button } from "@/app/_components/ui/button";
import { useSignIn } from "@clerk/nextjs";

export const GoogleLoginButton = () => {
  const { signIn } = useSignIn();

  const handleGoogleLogin = async () => {
    if (!signIn) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${window.location.origin}/onboarding`,
        redirectUrlComplete: `${window.location.origin}/onboarding`,
      });
    } catch {}
  };

  return <Button onClick={handleGoogleLogin}>Masuk dengan Google</Button>;
};
