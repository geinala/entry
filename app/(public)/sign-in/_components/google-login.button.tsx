"use client";

import { Button } from "@/app/_components/ui/button";
import { useSignIn } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";

export const GoogleLoginButton = () => {
  const [isClicked, setIsClicked] = useState(false);
  const { signIn } = useSignIn();

  const handleGoogleLogin = async () => {
    if (!signIn) return;

    const popup = window.open("", "clerk-google-login", "width=520,height=720");

    if (!popup) return;

    setIsClicked(true);

    try {
      popup.focus();

      await signIn.authenticateWithPopup({
        popup,
        strategy: "oauth_google",
        redirectUrl: `${window.location.origin}/onboarding`,
        redirectUrlComplete: `${window.location.origin}/onboarding`,
      });
    } finally {
      setIsClicked(false);
    }
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
