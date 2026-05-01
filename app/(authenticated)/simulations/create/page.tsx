"use client";

import Page from "@/app/_components/page";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Stepper } from "@/app/_components/ui/stepper";
import CreateSimulationForm from "./_components/form";

export default function CreateSimulationPage() {
  return (
    <Page title="Create Simulation" description="Create a new simulation.">
      <Stepper
        steps={[
          { id: "step1", label: "Step 1 - Basic Information" },
          { id: "step2", label: "Step 2 - Data Validation and Review" },
          { id: "step3", label: "Step 3 - Geocoding" },
          { id: "step4", label: "Step 4 - Calculation Best Routes" },
        ]}
        currentStep={"step1"}
        orientation="horizontal"
        clickableSteps={false}
      />
      <Card className="w-full">
        <CardContent>
          <CreateSimulationForm />
        </CardContent>
      </Card>
    </Page>
  );
}
