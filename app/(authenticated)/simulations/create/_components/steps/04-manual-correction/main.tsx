import { useFilters } from "@/app/_hooks/use-filters";
import { IndexQueryParams } from "@/types/query-params";
import { useState } from "react";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { CleaningAddressTable } from "./cleaning-address-table";
import { useGetDraftSimulationJobQuery } from "../../../../_hooks/use-queries";
import { useIgnoreAddressErrorRowMutation } from "../../../_hooks/use-mutations";
import { TSimulationUploadedRow } from "@/types/database";
import { useGetAllNeedReviewSimulationUploadedRows } from "../../../_hooks/use-queries";
import { ManualCorrectionLoading } from "./manual-correction-loading";
import { IgnoreAllAndContinueButton } from "./actions/ignore-all-and-continue.button";
import { ContinueToRouteOptimizationButton } from "./actions/continue-to-route-optimization.button";
import { IgnoreConfirmationDialog } from "./dialog/ignore-confirmation.dialog";
import { Alert, AlertDescription, AlertTitle } from "@/app/_components/ui/alert";
import { AlertCircle } from "lucide-react";

export const ManualCorrection = () => {
  const { handleChange, pagination } = useFilters(IndexQueryParams);
  const { data, isLoading } = useGetDraftSimulationJobQuery();
  const { mutateAsync: ignoreRowAsync, isPending: isIgnoringRow } =
    useIgnoreAddressErrorRowMutation();
  const [selectedRow, setSelectedRow] = useState<TSimulationUploadedRow | null>(null);
  const [isIgnoreDialogOpen, setIsIgnoreDialogOpen] = useState(false);

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

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-3 py-6">
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
            {uploadedRowsData?.data.length !== 0 && (
              <div className="mb-3 w-full">
                <Alert variant={"destructive"} className="w-full">
                  <AlertCircle />
                  <AlertTitle>System failed to geocode addresses</AlertTitle>
                  <AlertDescription>
                    Some addresses could not be geocoded. Please review and correct them.
                  </AlertDescription>
                </Alert>
              </div>
            )}
            <CleaningAddressTable
              source={uploadedRowsData}
              handleChange={handleChange}
              isLoading={isUploadedRowsLoading}
              pagination={pagination}
              jobId={data?.id}
              onDeleteRow={(row) => {
                setSelectedRow(row);
                setIsIgnoreDialogOpen(true);
              }}
            />

            <div className="w-full flex items-end justify-end gap-3 mt-3">
              <IgnoreAllAndContinueButton
                jobId={data.id}
                disabled={uploadedRowsData?.data.length === 0}
              />
              <ContinueToRouteOptimizationButton
                jobId={data.id}
                disabled={uploadedRowsData?.data.length !== 0}
              />
            </div>
          </>
        )}
      </div>

      <IgnoreConfirmationDialog
        open={isIgnoreDialogOpen}
        onOpenChange={setIsIgnoreDialogOpen}
        onConfirm={async () => {
          await ignoreRowAsync({
            jobId: data!.id,
            rowId: selectedRow!.id,
          });
          setIsIgnoreDialogOpen(false);
        }}
        isLoading={isIgnoringRow}
        title="Ignore Row"
        description="Are you sure you want to ignore this row? This action cannot be undone."
        confirmButtonText="Ignore"
      />
    </>
  );
};
