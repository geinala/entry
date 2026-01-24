import { Button } from "@/app/_components/ui/button";
import { Map, Trash } from "lucide-react";
import { toast } from "sonner";

const DeleteSimulationButton = () => {
  return (
    <Button onClick={() => toast.info("Coming Soon")} variant="destructive" size="sm">
      <Trash /> Delete
    </Button>
  );
};

const OpenSimulationButton = () => {
  return (
    <Button onClick={() => toast.info("Coming Soon")} size="sm" variant={"outline"}>
      <Map className="text-primary" /> Open Simulation
    </Button>
  );
};

export { DeleteSimulationButton, OpenSimulationButton };
