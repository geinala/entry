"use client";

import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/app/_components/ui/sidebar";
import { Calendar, ListFilter, Plus } from "lucide-react";
import { toast } from "sonner";

export const SimulationHistorySidebar = () => {
  return (
    <Sidebar containerClassName="relative h-full" className="h-full relative w-full">
      <SidebarHeader className="flex-row w-full justify-end items-center gap-2">
        <Input placeholder="Search simulation..." />
        <Button variant="ghost" size="icon">
          <ListFilter />
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <Card className="gap-3">
          <CardContent>
            <div className="w-full flex justify-between items-center">
              <CardTitle className="text-primary text-md">#SIM-ID</CardTitle>
              <Badge variant={"success"}>Done</Badge>
            </div>
            <CardTitle>SIM-NAME</CardTitle>
          </CardContent>
          <CardFooter>
            <CardDescription className="flex gap-2">
              <Calendar className="w-5 h-5" /> 2024-06-15
            </CardDescription>
          </CardFooter>
        </Card>
      </SidebarContent>
      <SidebarFooter>
        <Button
          onClick={() => {
            toast.info("Coming Soon");
          }}
        >
          <Plus /> Create New Simulation
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
