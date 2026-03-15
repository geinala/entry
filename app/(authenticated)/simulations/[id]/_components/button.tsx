"use client";

import { Button } from "@/app/_components/ui/button";
import { DialogTrigger } from "@/app/_components/ui/dialog";
import { Play } from "lucide-react";

const StartButton = () => {
  return (
    <DialogTrigger asChild>
      <Button>
        <Play /> Start Simulation
      </Button>
    </DialogTrigger>
  );
};

export { StartButton };
