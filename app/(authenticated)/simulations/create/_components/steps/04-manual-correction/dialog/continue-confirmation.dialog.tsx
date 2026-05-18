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
}

export const ContinueConfirmationDialog = ({ ...props }: IProps) => {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Continue to Next Step?</DialogTitle>
          <DialogDescription>
            Are you sure you want to continue to the next step? Please make sure to address all
            errors before proceeding.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={props.onConfirm} disabled={props.isLoading}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
