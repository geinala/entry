"use client";

import { Spinner } from "./ui/spinner";

export default function Loading() {
  return (
    <div className="w-dvw h-dvh flex justify-center items-center">
      <Spinner className="text-primary h-5 w-5" />
    </div>
  );
}
