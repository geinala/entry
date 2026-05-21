import { Button } from "@/app/_components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";

export const DeleteConfirmationDialog = ({
  onConfirm,
  onCancel,
  isLoading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure you want to delete this depot?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. Please confirm if you want to proceed with deleting this
          depot.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogClose>
        <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete Depot"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
