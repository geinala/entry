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

export const IgnoreConfirmationDialog = ({ ...props }: IProps) => {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title || "Ignore All Errors"}</DialogTitle>
          <DialogDescription>
            {props.description ||
              "All rows marked as errors will be permanently ignored before continuing the process."}
          </DialogDescription>
        </DialogHeader>
        <p className="mb-3">
          This action cannot be undone. Please make sure you want to ignore all error rows before
          proceeding.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" disabled={props.isLoading} onClick={props.onConfirm}>
            {props.confirmButtonText || "Ignore All and Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
