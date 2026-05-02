"use client";

import Page from "@/app/_components/page";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Stepper } from "@/app/_components/ui/stepper";
import CreateSimulationForm from "./_components/form";
import { useGetDraftSimulationJobQuery } from "../_hooks/use-queries";
import { useEffect } from "react";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";

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
          { id: "step1", label: "Step 1 - Basic Information" },
          { id: "step2", label: "Step 2 - Data Validation" },
          { id: "step3", label: "Step 3 - Data Cleaning and Review" },
          { id: "step4", label: "Step 4 - Geocoding" },
          { id: "step5", label: "Step 5 - Calculation Best Routes" },
        ]}
        currentStep={`step${!data ? 1 : data.currentStep + 1}`}
        orientation="horizontal"
        clickableSteps={false}
      />
      <Card className="w-full">
        <CardContent>
          {!data && <CreateSimulationForm />}
          {data && data.currentStep === 1 && <div>Data Validation</div>}
          {data && data.currentStep === 2 && <div>Data Cleaning and Review</div>}
          {data && data.currentStep === 3 && <div>Geocoding</div>}
          {data && data.currentStep === 4 && <div>Calculation Best Routes</div>}
        </CardContent>
      </Card>
    </Page>
  );
}
