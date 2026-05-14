import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Dialog as DialogPrimitive } from "radix-ui";

interface IProps extends React.ComponentProps<typeof DialogPrimitive.Root> {
  onConfirm: () => Promise<void> | void;
  isLoading: boolean;
  title?: string;
  description?: string;
  confirmButtonText?: string;
}

export const DeleteConfirmationDialog = ({ ...props }: IProps) => {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title || "Delete All Errors"}</DialogTitle>
          <DialogDescription>
            {props.description ||
              "All rows marked as errors will be permanently removed before continuing the process."}
          </DialogDescription>
        </DialogHeader>
        <p className="mb-4">
          This action cannot be undone. Please make sure you want to remove all error rows before
          proceeding.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" disabled={props.isLoading} onClick={props.onConfirm}>
            {props.confirmButtonText || "Delete All and Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
