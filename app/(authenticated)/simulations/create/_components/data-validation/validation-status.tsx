import React from "react";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/app/_components/ui/alert";
import { Button } from "@/app/_components/ui/button";
import { Progress } from "@/app/_components/ui/progress";
import { TSimulationJob } from "@/types/database";

type Props = {
  isFailed: boolean;
  errorRowsCount: number;
  data?: TSimulationJob;
  isReuploading: boolean;
  onReupload: () => void;
  isValidating: boolean;
  progress: number;
  processedRows: number;
  totalRows: number;
  isValidated: boolean;
};

export const ValidationStatus: React.FC<Props> = ({
  isFailed,
  errorRowsCount,
  data,
  isReuploading,
  onReupload,
  isValidating,
  progress,
  processedRows,
  totalRows,
  isValidated,
}) => {
  if (isFailed) {
    return (
      <div className="mb-4 space-y-4">
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>File validation failed</AlertTitle>
          <AlertDescription>
            <p>
              {errorRowsCount > 0
                ? "Some rows could not be validated. Please review the failed rows below or re-upload a corrected file."
                : "The uploaded file could not be validated. Please re-upload a corrected file to continue."}
            </p>
            {data?.invalidRows ? (
              <p>{data.invalidRows.toLocaleString()} invalid rows were detected.</p>
            ) : null}
          </AlertDescription>
        </Alert>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onReupload} disabled={isReuploading}>
            {isReuploading ? "Preparing re-upload..." : "Re-upload File"}
          </Button>
        </div>
      </div>
    );
  }

  if (isValidating) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-6">
        <Image src={"/images/logo_4x.png"} alt="Logo" width={100} height={100} />

        <div className="w-full max-w-md space-y-2">
          <div className="flex items-center justify-between text-sm">
            <p className="font-medium text-foreground">Validating uploaded data...</p>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {processedRows.toLocaleString()} / {totalRows.toLocaleString()} rows processed
          </p>
        </div>
      </div>
    );
  }

  if (isValidated) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-6">
        <Image src={"/images/logo_4x.png"} alt="Logo" width={100} height={100} />

        <div className="w-full max-w-md space-y-2 text-center">
          <p className="font-medium text-foreground">Validation complete</p>
          <p className="text-sm text-muted-foreground">Preparing the next step...</p>
          <Progress value={100} className="h-2" />
        </div>
      </div>
    );
  }

  return null;
};

export default ValidationStatus;
