import { useFilters } from "@/app/_hooks/use-filters";
import { IndexQueryParams } from "@/types/query-params";
import { FormEvent, useMemo, useState } from "react";
import {
  TEditableRowForm,
  toEditableForm,
  TSimulationUploadedRowWithErrors,
  TValidationErrorItem,
} from "./helpers";
import { TSimulationUploadedRow } from "@/types/database";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { ValidationStatus } from "./validation-status";
import ErrorRowsTable from "./error-rows-table";
import { Button } from "@/app/_components/ui/button";
import EditRowDialog from "./edit-row-dialog";
import { useGetDraftSimulationJobQuery } from "../../../_hooks/use-queries";
import {
  useDeleteDraftSimulationJobMutation,
  useUpdateSimulationJobMutation,
} from "../../../_hooks/use-mutations";
import {
  useDeleteSimulationUploadedRowMutation,
  useUpdateSimulationUploadedRowMutation,
} from "../../_hooks/use-mutations";
import { useGetSimulationUploadedRowsQuery } from "../../_hooks/use-queries";

export const DataValidation = () => {
  const { handleChange, pagination } = useFilters(IndexQueryParams);
  const { data, isLoading } = useGetDraftSimulationJobQuery();
  const { mutateAsync: deleteDraftAsync, isPending: isReuploading } =
    useDeleteDraftSimulationJobMutation();
  const { mutateAsync, isPending: isUpdatingRow } = useUpdateSimulationUploadedRowMutation();
  const { mutateAsync: deleteRowAsync, isPending: isDeletingRow } =
    useDeleteSimulationUploadedRowMutation();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TSimulationUploadedRowWithErrors | null>(null);
  const [formValues, setFormValues] = useState<TEditableRowForm | null>(null);

  const { data: uploadedRowsData, isLoading: isUploadedRowsLoading } =
    useGetSimulationUploadedRowsQuery(
      {
        ...pagination,
      },
      data?.fileValidationStatus,
      data?.id,
    );

  const isValidating =
    data?.fileValidationStatus === "uploaded" || data?.fileValidationStatus === "validating";
  const isValidated = data?.fileValidationStatus === "validated";
  const isFailed = data?.fileValidationStatus === "failed";
  const progress = Number(data?.progressPercentage ?? 0);
  const totalRows = Number(data?.totalRows ?? 0);
  const processedRows = Number(data?.processedRows ?? 0);

  const errorRowsTableData = useMemo(() => {
    const rows = uploadedRowsData?.data ?? [];

    const rowsWithErrors = rows
      .map((row: TSimulationUploadedRow) => {
        const errorDetails = Array.isArray(row.errorDetails)
          ? row.errorDetails
          : row.errorDetails
            ? [row.errorDetails]
            : [];

        return {
          ...row,
          normalizedErrorDetails: errorDetails.map((detail) => detail as TValidationErrorItem),
        };
      })
      .filter((row) => row.normalizedErrorDetails.length > 0);

    return {
      data: rowsWithErrors,
      meta: {
        page: uploadedRowsData?.meta?.page ?? pagination.page,
        pageSize: uploadedRowsData?.meta?.pageSize ?? pagination.pageSize,
        total: rowsWithErrors.length,
        totalPage: Math.max(
          1,
          Math.ceil(
            rowsWithErrors.length / (uploadedRowsData?.meta?.pageSize ?? pagination.pageSize),
          ),
        ),
      },
    };
  }, [uploadedRowsData, pagination.page, pagination.pageSize]);

  const handleEditRow = (row: TSimulationUploadedRowWithErrors) => {
    setSelectedRow(row);
    setFormValues(toEditableForm(row));
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (isUpdatingRow || isDeletingRow) return;

    setIsEditDialogOpen(false);
    setSelectedRow(null);
    setFormValues(null);
  };

  const handleDeleteRow = async (row: TSimulationUploadedRowWithErrors) => {
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
      id: data.id,
      payload: { nextStep: Number(data.currentStep) + 1, fileValidationStatus: "completed" },
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
          errorRowsCount={errorRowsTableData.data.length}
          data={data}
          isReuploading={isReuploading}
          onReupload={handleReuploadFile}
          isValidating={isValidating}
          progress={progress}
          processedRows={processedRows}
          totalRows={totalRows}
          isValidated={isValidated}
        />

        {data?.fileValidationStatus == "reviewing" && (
          <ErrorRowsTable
            source={errorRowsTableData}
            handleChange={handleChange}
            isLoading={isUploadedRowsLoading}
            pagination={pagination}
            onEditRow={handleEditRow}
            onDeleteRow={handleDeleteRow}
            isDeletingRow={isDeletingRow}
          />
        )}

        {/* Continue next step */}
        {data?.fileValidationStatus === "reviewing" && (
          <div className="w-full mt-3 flex items-end justify-end">
            <Button
              disabled={
                isLoading || errorRowsTableData.data.length > 0 || isUpdatingJob || isReuploading
              }
              onClick={handleContinue}
            >
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
