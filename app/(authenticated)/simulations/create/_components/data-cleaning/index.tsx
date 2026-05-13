import { useFilters } from "@/app/_hooks/use-filters";
import { IndexQueryParams } from "@/types/query-params";
import { FormEvent, useState } from "react";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { ValidationStatus } from "./validation-status";
import { CleaningAddressTable } from "./cleaning-address-table";
import { Button } from "@/app/_components/ui/button";
import EditRowDialog from "./edit-row-dialog";
import { useGetDraftSimulationJobQuery } from "../../../_hooks/use-queries";
import { useDeleteDraftSimulationJobMutation } from "../../../_hooks/use-mutations";
import {
  useDeleteSimulationUploadedRowMutation,
  useUpdateSimulationJobMutation,
  useUpdateSimulationUploadedRowMutation,
} from "../../_hooks/use-mutations";
import { useGetSimulationAddressErrors } from "../../_hooks/use-queries";
import { TPaginationResponse } from "@/types/meta";
import { TSimulationUploadedRow } from "@/types/database";
import { TEditableRowForm } from "../../helpers";
import { toast } from "sonner";

export const DataCleaningTable = () => {
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
    useGetSimulationAddressErrors(
      {
        ...pagination,
        onlyAddressErrors: true,
        onlyErrors: false,
      },
      data?.id,
    );

  const isValidating =
    data?.fileValidationStatus === "uploaded" || data?.fileValidationStatus === "validating";
  const isValidated = data?.fileValidationStatus === "validated";
  const isFailed = data?.fileValidationStatus === "failed";
  const progress = Number(data?.progressPercentage ?? 0);
  const totalRows = Number(data?.totalRows ?? 0);
  const processedRows = Number(data?.processedRows ?? 0);

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

  const handleReuploadFile = async () => {
    const shouldReupload = window.confirm(
      "Re-uploading will remove the current draft and let you upload a new file. Continue?",
    );

    if (!shouldReupload) return;

    await deleteDraftAsync();
  };

  const { mutateAsync: updateJobAsync, isPending: isUpdatingJob } =
    useUpdateSimulationJobMutation();

  const handleContinue = async () => {
    if (!data?.id) return;

    // Ask for confirmation before moving to next step
    const shouldContinue = window.confirm("Continue to next step? This will advance the workflow.");
    if (!shouldContinue) return;

    await updateJobAsync({
      simulationJobId: data.id,
      payload: { currentStep: Number(data.currentStep) + 1, fileValidationStatus: "completed" },
    });
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

  return (
    <>
      <div className="h-full w-full">
        <ValidationStatus
          isFailed={isFailed}
          errorRowsCount={0}
          data={data}
          isReuploading={isReuploading}
          onReupload={handleReuploadFile}
          isValidating={isValidating}
          progress={progress}
          processedRows={processedRows}
          totalRows={totalRows}
          isValidated={isValidated}
        />

        {data?.fileValidationStatus == "completed" && (
          <CleaningAddressTable
            source={uploadedRowsData as TPaginationResponse<TSimulationUploadedRow>}
            handleChange={handleChange}
            isLoading={isUploadedRowsLoading}
            pagination={pagination}
            onEditRow={handleEditRow}
            onDeleteRow={handleDeleteRow}
            isDeletingRow={isDeletingRow}
          />
        )}

        {/* Continue next step */}
        {data?.fileValidationStatus === "completed" && (
          <div className="w-full mt-3 flex items-end justify-end gap-3">
            <Button
              variant={"outline"}
              onClick={() => {
                toast.error("No errors to review. Continuing to next step.");
              }}
            >
              Ignore all errors and Continue
            </Button>
            <Button disabled={isLoading || isUpdatingJob || isReuploading} onClick={handleContinue}>
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
