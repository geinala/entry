import { useGetDraftSimulationJobQuery } from "@/app/(authenticated)/simulations/_hooks/use-queries";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexQueryParams } from "@/types/query-params";
import {
  useDeleteSimulationUploadedRowMutation,
  useUpdateSimulationUploadedRowMutation,
} from "../../../_hooks/use-mutations";
import { FormEvent, useMemo, useState } from "react";
import {
  TEditableRowForm,
  toEditableForm,
  TSimulationUploadedRowWithErrors,
  TValidationErrorItem,
} from "../../../helpers";
import { TSimulationUploadedRow } from "@/types/database";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { DataValidationLoading } from "./data-validatio.loading";
import ErrorRowsTable from "./error-rows.table";
import EditRowDialog from "./dialog/edit-row.dialog";
import { useGetAllNeedReviewSimulationUploadedRows } from "../../../_hooks/use-queries";
import { DeleteAllAndContinueButton } from "./actions/delete-all-and-continue.button";
import { ContinueToCleaningDataButton } from "./actions/continue-to-cleaning-data.button";
import { DeleteConfirmationDialog } from "./dialog/delete-confirmation.dialog";

export const DataValidation = () => {
  const { handleChange, pagination } = useFilters(IndexQueryParams);
  const { data, isLoading } = useGetDraftSimulationJobQuery();
  const { mutateAsync, isPending: isUpdatingRow } = useUpdateSimulationUploadedRowMutation();
  const { mutateAsync: deleteRowAsync, isPending: isDeletingRow } =
    useDeleteSimulationUploadedRowMutation();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TSimulationUploadedRowWithErrors | null>(null);
  const [formValues, setFormValues] = useState<TEditableRowForm | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: uploadedRowsData, isLoading: isUploadedRowsLoading } =
    useGetAllNeedReviewSimulationUploadedRows({
      queryParams: {
        ...pagination,
        currentStep: Number(data?.currentStep),
      },
      shouldRefetch: data?.fileValidationStatus === "needed_review",
      id: data?.id,
    });

  // Normalize error details and filter to only rows with errors
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

  // handle edit row, delete row, re-upload file, continue to next step, submit edit form
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
    setSelectedRow(row);
    setIsDeleteDialogOpen(true);
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

  if (
    data?.fileValidationStatus === "validating" ||
    data?.fileValidationStatus === "validated" ||
    data?.fileValidationStatus === "uploaded"
  ) {
    return <DataValidationLoading data={data} />;
  }

  return (
    <>
      <div className="h-full w-full">
        {data?.fileValidationStatus == "needed_review" && (
          <>
            <DataValidationLoading data={data} errorRowsCount={errorRowsTableData.data.length} />
            <ErrorRowsTable
              jobId={data.id}
              source={errorRowsTableData}
              handleChange={handleChange}
              isLoading={isUploadedRowsLoading}
              pagination={pagination}
              onEditRow={handleEditRow}
              onDeleteRow={handleDeleteRow}
              isDeletingRow={isDeletingRow}
              selectable
            />

            <div className="w-full flex items-end justify-end gap-3 mt-3">
              <DeleteAllAndContinueButton
                jobId={data.id}
                disabled={uploadedRowsData?.data.length === 0}
              />
              <ContinueToCleaningDataButton
                jobId={data.id}
                currentStep={Number(data.currentStep)}
                disabled={errorRowsTableData.data.length > 0 || isLoading}
              />
            </div>
          </>
        )}
      </div>

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={async () => {
          await deleteRowAsync({ jobId: data!.id, rowId: selectedRow!.id });
          setIsDeleteDialogOpen(false);
        }}
        isLoading={isDeletingRow}
        title="Delete Row"
        description="Are you sure you want to delete this row? This action cannot be undone."
        confirmButtonText="Delete"
      />

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
