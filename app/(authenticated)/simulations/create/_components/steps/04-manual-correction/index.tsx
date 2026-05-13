import { useFilters } from "@/app/_hooks/use-filters";
import { IndexQueryParams } from "@/types/query-params";
import { FormEvent, useState } from "react";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { CleaningAddressTable } from "./cleaning-address-table";
import { Button } from "@/app/_components/ui/button";
import EditRowDialog from "./edit-row-dialog";
import { useGetDraftSimulationJobQuery } from "../../../../_hooks/use-queries";
import { useDeleteDraftSimulationJobMutation } from "../../../../_hooks/use-mutations";
import {
  useDeleteSimulationUploadedRowMutation,
  useUpdateSimulationUploadedRowMutation,
} from "../../../_hooks/use-mutations";
import { TSimulationUploadedRow } from "@/types/database";
import { TEditableRowForm } from "../../../helpers";
import { toast } from "sonner";
import { useGetAllNeedReviewSimulationUploadedRows } from "../../../_hooks/use-queries";
import { ManualCorrectionLoading } from "./manual-correction-loading";

export const ManualCorrection = () => {
  const { handleChange, pagination } = useFilters(IndexQueryParams);
  const { data, isLoading } = useGetDraftSimulationJobQuery();
  const { mutateAsync: deleteDraftAsync, isPending: isReuploading } =
    useDeleteDraftSimulationJobMutation();
  const { mutateAsync, isPending: isUpdatingRow } = useUpdateSimulationUploadedRowMutation();
  const { mutateAsync: deleteRowAsync, isPending: isDeletingRow } =
    useDeleteSimulationUploadedRowMutation();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TSimulationUploadedRow | null>(null);
  const [formValues, setFormValues] = useState<TEditableRowForm | null>(null);

  const { data: uploadedRowsData, isLoading: isUploadedRowsLoading } =
    useGetAllNeedReviewSimulationUploadedRows({
      queryParams: {
        ...pagination,
        currentStep: Number(data?.currentStep),
      },
      id: data?.id,
      shouldRefetch: data?.geocodingStatus === "needed_review",
    });

  const isValidating = data?.geocodingStatus === "in_progress";
  const isValidated = data?.geocodingStatus === "completed";
  const progress = Number(data?.geocodingProgressPercentage ?? 0);
  const totalRows = Number(data?.geocodingTotalRows ?? 0);
  const processedRows = Number(data?.geocodingProcessedRows ?? 0);

  const handleEditRow = (row: TSimulationUploadedRow) => {
    setSelectedRow(row);
    // setFormValues(toEditableForm(row));
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (isUpdatingRow || isDeletingRow) return;

    setIsEditDialogOpen(false);
    setSelectedRow(null);
    setFormValues(null);
  };

  const handleDeleteRow = async (row: TSimulationUploadedRow) => {
    if (!data?.id) return;

    const shouldDelete = window.confirm(
      `Delete uploaded row ${row.id}${row.nosi ? ` (${row.nosi})` : ""}? This cannot be undone.`,
    );

    if (!shouldDelete) return;

    await deleteRowAsync({
      jobId: data.id,
      rowId: row.id,
    });

    if (selectedRow?.id === row.id) {
      handleCloseDialog();
    }
  };

  const handleContinue = async () => {
    if (!data?.id) return;

    // Ask for confirmation before moving to next step
    const shouldContinue = window.confirm("Continue to next step? This will advance the workflow.");
    if (!shouldContinue) return;
  };

  const handleSubmitEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedRow || !formValues || !data?.id) return;

    await mutateAsync({
      jobId: data.id,
      rowId: selectedRow.id,
      payload: {
        nosi: formValues.nosi,
        courier: formValues.courier,
        customerName: formValues.customerName,
        address: formValues.address,
        city: formValues.city,
        weight: Number(formValues.weight),
        startDatetime: formValues.startDatetime,
        endDatetime: formValues.endDatetime,
      },
    });

    handleCloseDialog();
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-4 py-6">
        <Skeleton className="h-25 w-25 rounded-full" />
        <div className="w-full max-w-md space-y-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    );
  }

  if (isValidating) {
    return <ManualCorrectionLoading data={data} />;
  }

  return (
    <>
      <div className="h-full w-full">
        {data?.geocodingStatus == "needed_review" && (
          <>
            <ManualCorrectionLoading data={data} />
            <CleaningAddressTable
              source={uploadedRowsData}
              handleChange={handleChange}
              isLoading={isUploadedRowsLoading || uploadedRowsData?.data.length === 0}
              pagination={pagination}
              onEditRow={handleEditRow}
              onDeleteRow={handleDeleteRow}
              isDeletingRow={isDeletingRow}
            />
          </>
        )}

        {/* Continue next step */}
        {data?.geocodingStatus === "completed" && (
          <div className="w-full mt-3 flex items-end justify-end gap-3">
            <Button
              variant={"outline"}
              onClick={() => {
                toast.error("No errors to review. Continuing to next step.");
              }}
            >
              Ignore all errors and Continue
            </Button>
            <Button disabled={isLoading || isReuploading} onClick={handleContinue}>
              Continue to Cleaning Data
            </Button>
          </div>
        )}
      </div>

      <EditRowDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => (!open ? handleCloseDialog() : null)}
        selectedRow={selectedRow}
        formValues={formValues}
        setFormValues={setFormValues}
        isUpdatingRow={isUpdatingRow}
        onSubmit={handleSubmitEdit}
      />
    </>
  );
};
