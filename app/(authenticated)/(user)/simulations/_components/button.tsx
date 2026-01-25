"use client";

import { Button } from "@/app/_components/ui/button";
import { Map, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DeleteSimulationButton = () => {
  return (
    <Button
      onClick={() => {
        // TODO: Implement delete functionality
        toast.info("Coming Soon");
      }}
      variant="destructive"
      size="sm"
    >
      <Trash /> Delete
    </Button>
  );
};

const OpenSimulationButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        // TODO: Replace with actual simulation ID
        router.push("/simulations/1");
      }}
      size="sm"
      variant={"outline"}
    >
      <Map className="text-primary" /> Open Simulation
    </Button>
  );
};

export { DeleteSimulationButton, OpenSimulationButton };
