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
import { useEffect } from "react";

export default function OnboardingPage() {
  const { data } = useUserOnboarding();

  useEffect(() => {
    console.log("Onboarding data:", data);
  }, [data]);

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
