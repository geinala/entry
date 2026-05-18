import { Button } from "@/app/_components/ui/button";
import { X } from "lucide-react";
import { ButtonHTMLAttributes, useState } from "react";
import { useBulkIgnoreSelectedErrorRowsMutation } from "../../../../_hooks/use-mutations";
import { IgnoreConfirmationDialog } from "../dialog/ignore-confirmation.dialog";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selectedRowIds: number[];
  jobId: string;
}

export const BulkIgnoreButton = ({ selectedRowIds, jobId, ...rest }: IProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutateAsync, isPending } = useBulkIgnoreSelectedErrorRowsMutation();

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        disabled={selectedRowIds.length === 0 || isPending}
        onClick={() => setIsDialogOpen(true)}
        {...rest}
      >
        <X />
        Ignore Selected
      </Button>

      <IgnoreConfirmationDialog
        title="Ignore Selected Error Rows"
        onConfirm={async () => {
          await mutateAsync({ jobId, schema: { rowIds: selectedRowIds } });
          setIsDialogOpen(false);
        }}
        isLoading={isPending}
        onOpenChange={setIsDialogOpen}
        open={isDialogOpen}
        confirmButtonText="Ignore All"
      />
    </>
  );
};
