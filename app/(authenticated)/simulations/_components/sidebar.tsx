"use client";

import { GuardComponent } from "@/app/_components/guard";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/app/_components/ui/card";
import { DialogTrigger } from "@/app/_components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/app/_components/ui/sidebar";
import { PERMISSIONS } from "@/common/constants/permissions/permissions";
import { Calendar, ListFilter, Plus } from "lucide-react";
import { useGetInfiniteSimulationsQuery } from "../_hooks/use-queries";
import { useFilters } from "@/app/_hooks/use-filters";
import { IndexSimulationQueryParams } from "@/schemas/simulation.schema";
import { Search } from "@/app/_components/data-table/search";
import { FilterTable } from "@/app/_components/data-table/filter";
import { TFilterItem } from "@/app/_components/data-table/filter-collections/factory";
import { simulationStatusEnum } from "@/drizzle/schema";
import { convertUtcToLocalTime, toTitleCase, truncateText } from "@/lib/utils";
import { InfinityScroll } from "@/app/_components/infinity-scroll";
import { TSimulation } from "@/types/database";

export const SimulationHistorySidebar = () => {
  const { pagination, filters, search, handleChange } = useFilters(IndexSimulationQueryParams);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetInfiniteSimulationsQuery({
    ...pagination,
    search: filters.search,
    sort: filters.sort,
    status: filters.status,
  });

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
      <SidebarHeader className="flex flex-col gap-2">
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
      <SidebarContent className="px-2 flex-1 min-h-0 overflow-hidden">
        <div className="overflow-y-auto h-full space-y-2 scrollbar-thin">
          {data?.map((page) => (
            <SimulationCard {...page} key={page.id} />
          ))}
          <InfinityScroll
            handleLoadMore={fetchNextPage}
            isLoading={isFetchingNextPage}
            hasMore={hasNextPage}
          />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <GuardComponent requirePermission={PERMISSIONS.CREATE_SIMULATION}>
          <DialogTrigger asChild>
            <Button>
              <Plus /> Create New Simulation
            </Button>
          </DialogTrigger>
        </GuardComponent>
      </SidebarFooter>
    </Sidebar>
  );
};

const SimulationCard = (data: TSimulation) => {
  return (
    <Card className="gap-3 shadow-none relative overflow-hidden">
      <div className="h-fit w-full flex justify-center items-center absolute top-0 left-0">
        <div className="bg-primary w-full h-[2.8px] rounded-full" />
      </div>
      <CardContent>
        <div className="w-full flex justify-between items-center">
          <CardTitle className="text-primary text-md">{truncateText(data.id, 10)}</CardTitle>
          <Badge variant={"success"}>{data.status}</Badge>
        </div>
        <CardTitle>{truncateText(data.title, 30)}</CardTitle>
      </CardContent>
      <CardFooter>
        <CardDescription className="flex gap-2">
          <Calendar className="w-5 h-5" />{" "}
          {`${convertUtcToLocalTime({ utcDateStr: data.createdAt.toString(), format: "PPpp" })}`}
        </CardDescription>
      </CardFooter>
    </Card>
  );
};
