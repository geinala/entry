import { useGetSimulationJobSummary } from "../../../_hooks/use-queries";
import { AreaDistributionSummary } from "./area-distribution-summary";
import { DatasetSummary } from "./dataset-summary";
import { GeocodingSummary } from "./geocoding-summary";

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
    </div>
  );
};

export default PreRouteOptimizationStep;
