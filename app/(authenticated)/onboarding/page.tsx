"use client";

import { Spinner } from "@/app/_components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { ShieldCheck } from "lucide-react";
import { useUserOnboarding } from "./_hooks/use-user-onboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/app/_components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

export default function OnboardingPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { data, isLoading } = useUserOnboarding();

  useEffect(() => {
    if (!isLoading && data && data.registered) {
      router.replace(`${data.redirectTo}`);
    }
  }, [data, isLoading, router]);

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

        <CardContent className="flex justify-center">
          {isLoading && <Spinner className="h-8 w-8 text-primary animate-spin" />}
          {!isLoading && data && !data.registered && (
            <div className="flex flex-col justify-center items-center gap-2">
              <p className="text-sm text-muted-foreground">
                It seems like you are not registered yet.
              </p>
              <Button
                onClick={() => {
                  toast.info("Redirecting to waitlist page...", {
                    duration: 2000,
                    closeButton: false,
                    dismissible: false,
                    onAutoClose: () => {
                      signOut({ redirectUrl: "/waitlist" });
                    },
                  });
                }}
              >
                Request Access
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
