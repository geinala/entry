import { Button } from "@/app/_components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { useGetDraftSimulationJobQuery } from "../_hooks/use-queries";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useDeleteDraftSimulationJobMutation } from "../_hooks/use-mutations";
import { useRouter } from "next/navigation";

export const DraftSimulationJobDialog = () => {
  const { data, isLoading } = useGetDraftSimulationJobQuery();
  const router = useRouter();
  const { mutateAsync } = useDeleteDraftSimulationJobMutation();

  if (isLoading) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Loading draft...</DialogTitle>
        </DialogHeader>
      </DialogContent>
    );
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>You have an unfinished simulation</DialogTitle>
        <DialogDescription>
          We found a draft simulation job. You can continue where you left off or start a new one.
        </DialogDescription>
      </DialogHeader>

      {/* 🔹 Ringkasan Draft */}
      <div className="py-3 space-y-2 text-sm">
        <div>
          <span className="font-medium">Title:</span> {data?.title || "-"}
        </div>
        <div>
          <span className="font-medium">Last updated:</span>{" "}
          {data ? formatDistanceToNow(new Date(data.updatedAt), { addSuffix: true }) : "-"}
        </div>
        <div>
          <span className="font-medium">Status:</span> Draft
        </div>
      </div>

      {/* 🔹 Actions */}
      <DialogFooter className="flex justify-between">
        {/* Start new */}
        <Button variant="outline" onClick={() => mutateAsync()}>
          Start New Simulation
        </Button>

        {/* Continue */}
        <Button
          onClick={() => {
            router.push(`/simulations/create?id=${data?.id}`);
          }}
        >
          Continue Draft
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
