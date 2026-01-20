"use client";

import { Spinner } from "@/app/_components/ui/spinner";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCheckUser } from "./_hooks/use-check-user";
import { useUserOnboard } from "./_hooks/use-user-onboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { signOut, user, isSignedIn } = useClerk();
  const { checkUser } = useCheckUser();
  const { onboardUser } = useUserOnboard();

  useEffect(() => {
    const handleOnboarding = async () => {
      if (isSignedIn && user) {
        const userExists = await checkUser(user.id, () => {
          router.replace("/history");
        });

        if (userExists) {
          return;
        }

        await onboardUser(
          {
            clerkUserId: user.id,
            email: user.primaryEmailAddress?.emailAddress || "",
            fullName: user.fullName || "",
          },
          () => {
            router.replace("/history");
          },
          () => {
            setTimeout(async () => {
              await signOut();
              router.replace("/sign-in");
            }, 2000);
          },
        );
      }
    };

    handleOnboarding();
  }, [isSignedIn, user, checkUser, onboardUser, router, signOut]);

  return (
    <main className="w-dvw h-dvh flex justify-center items-center">
      <Card className="w-full max-w-md mx-auto text-center shadow-lg">
        <CardHeader className="space-y-4">
          {" "}
          <div className="flex justify-center">
            <ShieldCheck className="h-14 w-14 text-green-600" />
          </div>
          <div className="space-y-2">
            {" "}
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">
              Verifying your account
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              This will only take a moment. Please keep this window open while we secure your data.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex justify-center py-3">
          <Spinner className="h-8 w-8 text-primary animate-spin" />
        </CardContent>
      </Card>
    </main>
  );
}
