"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { useDeleteSimulationByIdMutation } from "../_hooks/use-mutations";
import { Map, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface IDeleteSimulationButton {
  simulationId: string;
  onDeleted: () => void;
}

const DeleteSimulationButton = ({ simulationId, onDeleted }: IDeleteSimulationButton) => {
  const deleteSimulationMutation = useDeleteSimulationByIdMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteSimulationMutation.mutateAsync(simulationId);
      setIsDialogOpen(false);
      onDeleted();
    } catch {
      toast.error("Failed to delete simulation");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={deleteSimulationMutation.isPending}>
          <Trash /> Delete
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete simulation?</DialogTitle>
          <DialogDescription>
            This action will permanently delete the simulation and all related data. This cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            disabled={deleteSimulationMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteSimulationMutation.isPending}
          >
            {deleteSimulationMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const OpenSimulationButton = () => {
  return (
    <Button size="sm" variant={"outline"}>
      <Map className="text-primary" /> Open Simulation
    </Button>
  );
};

export { DeleteSimulationButton, OpenSimulationButton };
