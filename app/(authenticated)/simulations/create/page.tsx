"use client";

import Page from "@/app/_components/page";
import { Stepper } from "@/app/_components/ui/stepper";
import CreateSimulationForm from "./_components/form";
import { useEffect } from "react";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useGetDraftSimulationJobQuery } from "../_hooks/use-queries";
import { Card, CardContent } from "@/app/_components/ui/card";
import { DataValidation } from "./_components/data-validation/index";
import { DataCleaningTable } from "./_components/data-cleaning";

export default function CreateSimulationPage() {
  const { data } = useGetDraftSimulationJobQuery();
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Simulations", href: "/simulations" },
      { label: "Create Simulation", href: "/simulations/create" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <Page title="Create Simulation" description="Create a new simulation.">
      <Stepper
        steps={[
          { id: "step1", label: "Basic Information" },
          { id: "step2", label: "Data Validation" },
          { id: "step3", label: "Data Cleaning and Review" },
          { id: "step4", label: "Geocoding" },
          { id: "step5", label: "Calculation Best Routes" },
        ]}
        currentStep={`step${!data ? 1 : data.currentStep + 1}`}
        orientation="horizontal"
        clickableSteps={false}
      />
      <Card className="w-full">
        <CardContent>
          {!data && <CreateSimulationForm />}
          {data && data.currentStep === 1 && <DataValidation />}
          {data && data.currentStep === 2 && <DataCleaningTable />}
          {data && data.currentStep === 3 && <div>Geocoding</div>}
          {data && data.currentStep === 4 && <div>Calculation Best Routes</div>}
        </CardContent>
      </Card>
    </Page>
  );
}
