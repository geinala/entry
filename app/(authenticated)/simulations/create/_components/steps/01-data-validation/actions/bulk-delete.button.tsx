import { Button } from "@/app/_components/ui/button";
import { Trash2 } from "lucide-react";
import { ButtonHTMLAttributes, useState } from "react";
import { useBulkDeleteSelectedErrorRowsMutation } from "../../../../_hooks/use-mutations";
import { DeleteConfirmationDialog } from "../dialog/delete-confirmation.dialog";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selectedRowIds: number[];
  jobId: string;
}

export const BulkDeleteErrorRowsButton = ({ selectedRowIds, jobId, ...rest }: IProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutateAsync, isPending } = useBulkDeleteSelectedErrorRowsMutation();

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        disabled={selectedRowIds.length === 0 || isPending}
        onClick={() => setIsDialogOpen(true)}
        {...rest}
      >
        <Trash2 />
        Delete Selected
      </Button>

      <DeleteConfirmationDialog
        title="Delete Selected Error Rows"
        onConfirm={async () => {
          await mutateAsync({ jobId, schema: { rowIds: selectedRowIds } });
          setIsDialogOpen(false);
        }}
        isLoading={isPending}
        onOpenChange={setIsDialogOpen}
        open={isDialogOpen}
        confirmButtonText="Delete All"
      />
    </>
  );
};
