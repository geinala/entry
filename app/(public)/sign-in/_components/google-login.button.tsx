"use client";

import { Button } from "@/app/_components/ui/button";
import { useSignIn } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";

export const GoogleLoginButton = () => {
  const [isClicked, setIsClicked] = useState(false);
  const { signIn } = useSignIn();

  const handleGoogleLogin = async () => {
    setIsClicked(true);

    if (!signIn) return;

    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: `${window.location.origin}/onboarding`,
      redirectUrlComplete: `${window.location.origin}/onboarding`,
    });
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      variant={"outline"}
      size={"sm"}
      className="w-full max-w-xs"
      disabled={isClicked}
      isLoading={isClicked}
    >
      <Image
        src="/images/google-logo.svg"
        alt="Google Logo"
        width={20}
        height={20}
        className="mr-2"
      />
      Sign in with Google
    </Button>
  );
};
