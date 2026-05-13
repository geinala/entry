"use client";

import Page from "@/app/_components/page";
import { Stepper } from "@/app/_components/ui/stepper";
import CreateSimulationForm from "./_components/form";
import { useEffect } from "react";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useGetDraftSimulationJobQuery } from "../_hooks/use-queries";
import { Card, CardContent } from "@/app/_components/ui/card";
import { DataValidation } from "./_components/data-validation/index";

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
          { id: "step3", label: "Geocoding & Auto Resolution" },
          { id: "step4", label: "Manual Review & Correction" },
          { id: "step5", label: "Calculate Best Routes" },
        ]}
        currentStep={`step${!data ? 1 : data.currentStep + 1}`}
        orientation="horizontal"
        clickableSteps={false}
      />
      <Card className="w-full">
        <CardContent>
          {/* Step 1: Basic Information */}
          {!data && <CreateSimulationForm />}
          {/* Step 2: Data Validation */}
          {data && data.currentStep === 1 && <DataValidation />}
          {/* Step 3: Geocoding & Auto Resolution */}
          {data && data.currentStep === 2 && <div>Geocoding & Auto Resolution</div>}
          {/* Step 4: Manual Review & Correction */}
          {data && data.currentStep === 3 && <div>Manual Review & Correction</div>}{" "}
          {/* Step 5: Calculate Best Routes */}
          {data && data.currentStep === 4 && <div>Calculate Best Routes</div>}{" "}
        </CardContent>
      </Card>
    </Page>
  );
}
