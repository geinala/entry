import { TSimulationJob } from "@/types/database";
import ValidationStatus from "../validation-status";

interface GeocodingLoadingProps {
  data: TSimulationJob | null;
}

export const GeocodingLoading = ({ data }: GeocodingLoadingProps) => {
  const isProcessing = data?.geocodingStatus === "in_progress";
  const isProcessed =
    data?.geocodingStatus === "completed" || data?.geocodingStatus === "needed_review";

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <ValidationStatus
        isFailed={false}
        isReuploading={false}
        isProcessing={isProcessing}
        progress={Number(data?.geocodingProgressPercentage ?? 0)}
        processedRows={Number(data?.geocodingProcessedRows ?? 0)}
        totalRows={Number(data?.fileTotalRows ?? 0)}
        isProcessed={isProcessed}
      />
    </div>
  );
};
