"use client";

import { Spinner } from "./ui/spinner";

export default function Loading({ isFullscreen = true }: { isFullscreen?: boolean } = {}) {
  return (
    <div className={`flex justify-center items-center ${isFullscreen ? "w-dvw h-dvh" : ""}`}>
      <Spinner className="text-primary h-5 w-5" />
    </div>
  );
}
