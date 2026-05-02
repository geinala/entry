"use client";

import { GuardComponent } from "@/app/_components/guard";
import { Button } from "@/app/_components/ui/button";
import { DialogTrigger } from "@/app/_components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/app/_components/ui/sidebar";
import { PERMISSIONS } from "@/common/constants/permissions/permissions";
import { ListFilter, Plus } from "lucide-react";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexSimulationQueryParams } from "@/schemas/simulation.schema";
import { Search } from "@/app/_components/data-table/search";
import { FilterTable } from "@/app/_components/data-table/filter";
import { TFilterItem } from "@/app/_components/data-table/filter-collections/factory";
import { simulationStatusEnum } from "@/drizzle/schema";
import { toTitleCase } from "@/lib/utils";
import { useGetDraftSimulationJobQuery } from "../_hooks/use-queries";
import Link from "next/link";

interface ISimulationHistorySidebar {
  onSelectSimulation: (simulationId: string) => void;
}

export const SimulationHistorySidebar = ({ onSelectSimulation }: ISimulationHistorySidebar) => {
  const { data, isLoading } = useGetDraftSimulationJobQuery();
  const { pagination, filters, search, handleChange } = useFilters(IndexSimulationQueryParams);

  // const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetInfiniteSimulationsQuery({
  //   ...pagination,
  //   search: filters.search,
  //   sort: filters.sort,
  //   status: filters.status,
  // });

  const filterComponents: TFilterItem[] = [
    {
      name: "status",
      type: "Select",
      label: "Status",
      options: simulationStatusEnum.enumValues.map((status) => ({
        label: toTitleCase(status),
        value: status,
      })),
      value: filters.status,
    },
  ];

  return (
    <Sidebar
      containerClassName="relative h-full overflow-hidden flex flex-col"
      className="h-full relative w-full flex flex-col"
    >
      <SidebarHeader className="flex flex-col gap-2 p-3">
        <div className="flex flex-row w-full justify-end items-center gap-2">
          <Search
            search={search}
            placeholderSearch="Search by title..."
            onSearchChange={handleChange.onSearch}
          />
          <FilterTable
            trigger={
              <Button variant={"outline"} size={"sm"}>
                <ListFilter className="h-4 w-4" />
              </Button>
            }
            filterItems={filterComponents}
            onChange={handleChange.onFilterChange}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 flex-1 min-h-0 overflow-hidden">
        {/* {data?.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <Paragraph className="text-muted-foreground">No simulations found</Paragraph>
          </div>
        ) : (
          <div className="overflow-y-auto h-full space-y-4 scrollbar-thin">
            {data?.map((page) => (
              <SimulationCard {...page} key={page.id} onSelectSimulation={onSelectSimulation} />
            ))}
            <InfinityScroll
              handleLoadMore={fetchNextPage}
              isLoading={isFetchingNextPage}
              hasMore={hasNextPage}
            />
          </div>
        )} */}
      </SidebarContent>
      <SidebarFooter>
        <GuardComponent requirePermission={PERMISSIONS.CREATE_SIMULATION}>
          <Link href="/simulations/create">
            <Button className="w-full">
              <Plus /> Create New Simulation
            </Button>
          </Link>
        </GuardComponent>
      </SidebarFooter>
    </Sidebar>
  );
};

// const STATUS_CONFIG = {
//   pending: { color: "bg-amber-100 text-amber-800", label: "Pending" },
//   processing: { color: "bg-yellow-100 text-yellow-800", label: "Processing" },
//   running: { color: "bg-blue-100 text-blue-800", label: "Running" },
//   completed: { color: "bg-green-100 text-green-800", label: "Completed" },
//   failed: { color: "bg-red-100 text-red-800", label: "Failed" },
// } as const satisfies Record<TSimulationStatus, { color: string; label: string }>;

// const SimulationCard = (
//   data: TSimulation & { onSelectSimulation: (simulationId: string) => void },
// ) => {
//   return (
//     <Card
//       className="gap-3 shadow-none relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform select-none hover:brightness-95"
//       onClick={() => data.onSelectSimulation(data.id)}
//     >
//       <div className="h-fit w-full flex justify-center items-center absolute top-0 left-0">
//         <div className="bg-primary w-full h-[2.8px] rounded-full" />
//       </div>
//       <CardContent className="px-4">
//         <div className="w-full flex justify-between items-center">
//           <CardTitle className="text-primary text-md">{truncateText(data.id, 15)}</CardTitle>
//           <Badge variant={"success"} className={STATUS_CONFIG[data.status].color}>
//             {STATUS_CONFIG[data.status].label}
//           </Badge>
//         </div>
//         <CardTitle>{truncateText(data.title, 30)}</CardTitle>
//       </CardContent>
//       <CardFooter className="px-4">
//         <CardDescription className="flex gap-2 justify-center items-center">
//           <Calendar className="w-4 h-4 bg-slate-100" />{" "}
//           <Paragraph>
//             {`${convertUtcToLocalTime({ utcDateStr: data.createdAt.toString(), format: "PPpp" })}`}
//           </Paragraph>
//         </CardDescription>
//       </CardFooter>
//     </Card>
//   );
// };
