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
import { Map, RotateCw, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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
            This action will permanently delete the simulation and all related data. This cannot be
            undone.
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

const RefreshSimulationDetailsButton = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    await queryClient.invalidateQueries({
      refetchType: "all",
    });

    setIsRefreshing(false);
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleRefresh}
      disabled={isRefreshing}
      isLoading={isRefreshing}
    >
      <RotateCw className="text-primary" />
      {isRefreshing ? "Refreshing..." : "Refresh"}
    </Button>
  );
};

export { DeleteSimulationButton, OpenSimulationButton, RefreshSimulationDetailsButton };
