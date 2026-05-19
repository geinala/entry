import { useGetSimulationJobSummary } from "../../../_hooks/use-queries";
import { AreaDistributionSummary } from "./area-distribution-summary";
import { DatasetSummary } from "./dataset-summary";
import { GeocodingSummary } from "./geocoding-summary";
import { ProcessToOptimizationButton } from "./actions/process-to-optimization.button";

interface IProps {
  simulationJobId: string;
}

const PreRouteOptimizationStep = ({ simulationJobId }: IProps) => {
  const { data } = useGetSimulationJobSummary(simulationJobId);

  return (
    <div className="flex flex-col gap-5">
      <DatasetSummary data={data?.datasetSummary} />
      <GeocodingSummary data={data?.geocodingSummary} />
      <AreaDistributionSummary data={data?.areaDistribution} />

      <div className="ml-auto mt-3">
        <ProcessToOptimizationButton />
      </div>
    </div>
  );
};

export default PreRouteOptimizationStep;
