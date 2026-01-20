"use client";

import { useEffect } from "react";
import { useUserOnboarding } from "../../onboarding/_hooks/use-user-onboard";

export default function HistoryPage() {
  const { data } = useUserOnboarding();

  useEffect(() => {
    console.log("Onboarding data in History Page:", data);
  }, [data]);

  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-4">
      <h1>Hallo! Ini Halaman History</h1>
    </div>
  );
}
