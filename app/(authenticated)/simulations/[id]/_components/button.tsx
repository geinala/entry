"use client";

import { Button } from "@/app/_components/ui/button";
import { Play } from "lucide-react";

// TODO: Implement start simulation functionality
export default function StartButton() {
  return (
    <Button disabled>
      <Play /> Start Simulation
    </Button>
  );
}
