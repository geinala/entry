"use client";

import { Button } from "@/app/_components/ui/button";
import { Play } from "lucide-react";
import { toast } from "sonner";

// TODO: Implement start simulation functionality
const StartButton = () => {
  return (
    <Button onClick={() => toast.warning("This feature is not implemented yet")}>
      <Play /> Start Simulation
    </Button>
  );
};

export { StartButton };
