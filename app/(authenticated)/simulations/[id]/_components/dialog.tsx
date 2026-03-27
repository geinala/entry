"use client";

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { useRef } from "react";
import { ConstraintsForm } from "./form";

export const ConstraintsFormDialog = () => {
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Simulation Constraints</DialogTitle>
        <DialogDescription>
          Configure the vehicles and computation limits used for this simulation.
        </DialogDescription>
      </DialogHeader>
      <ConstraintsForm onSuccess={() => closeRef.current?.click()} />
      <DialogClose ref={closeRef} className="hidden" />
    </DialogContent>
  );
};
