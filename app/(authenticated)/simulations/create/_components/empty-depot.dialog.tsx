"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";

type EmptyDepotDialogProps = {
  open: boolean;
};

const EmptyDepotDialog = ({ open }: EmptyDepotDialogProps) => {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={() => undefined}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No depot found</DialogTitle>
          <DialogDescription>
            You need to create a depot first before starting a simulation job.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => router.push("/depots")}>
            View Depots
          </Button>
          <Button type="button" onClick={() => router.push("/depots/create")}>
            Create Depot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmptyDepotDialog;
