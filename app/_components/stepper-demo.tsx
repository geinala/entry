"use client";

import { useState } from "react";
import { Stepper, type StepItem } from "@/app/_components/ui/stepper";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { CheckCircle2, Settings, Users, FileText } from "lucide-react";

// Sample steps data
const simulationSteps: StepItem[] = [
  {
    id: "basic",
    label: "Basic Information",
    description: "Configure basic simulation details",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: "settings",
    label: "Settings",
    description: "Set simulation parameters",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    id: "participants",
    label: "Participants",
    description: "Add simulation participants",
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: "review",
    label: "Review",
    description: "Review and confirm",
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
];

export function StepperHorizontalDemo() {
  const [currentStep, setCurrentStep] = useState("basic");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Horizontal Stepper - With Icons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Stepper
            steps={simulationSteps}
            currentStep={currentStep}
            orientation="horizontal"
            onStepChange={setCurrentStep}
            clickableSteps={true}
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const currentIndex = simulationSteps.findIndex((s) => s.id === currentStep);
                if (currentIndex > 0) {
                  setCurrentStep(simulationSteps[currentIndex - 1].id);
                }
              }}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                const currentIndex = simulationSteps.findIndex((s) => s.id === currentStep);
                if (currentIndex < simulationSteps.length - 1) {
                  setCurrentStep(simulationSteps[currentIndex + 1].id);
                }
              }}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function StepperVerticalDemo() {
  const [currentStep, setCurrentStep] = useState("basic");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vertical Stepper - With Numbers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Stepper
            steps={simulationSteps}
            currentStep={currentStep}
            orientation="vertical"
            onStepChange={setCurrentStep}
            clickableSteps={true}
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const currentIndex = simulationSteps.findIndex((s) => s.id === currentStep);
                if (currentIndex > 0) {
                  setCurrentStep(simulationSteps[currentIndex - 1].id);
                }
              }}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                const currentIndex = simulationSteps.findIndex((s) => s.id === currentStep);
                if (currentIndex < simulationSteps.length - 1) {
                  setCurrentStep(simulationSteps[currentIndex + 1].id);
                }
              }}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function StepperNonClickableDemo() {
  const steps: StepItem[] = [
    { id: "step1", label: "Step 1", description: "First step" },
    { id: "step2", label: "Step 2", description: "Second step" },
    { id: "step3", label: "Step 3", description: "Third step" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Non-Clickable Stepper (Read-only)</CardTitle>
      </CardHeader>
      <CardContent>
        <Stepper
          steps={steps}
          currentStep="step2"
          orientation="horizontal"
          clickableSteps={false}
        />
      </CardContent>
    </Card>
  );
}

export function StepperMinimalDemo() {
  const steps: StepItem[] = [
    { id: "order", label: "Order" },
    { id: "payment", label: "Payment" },
    { id: "confirmation", label: "Confirmation" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minimal Stepper (No Connectors)</CardTitle>
      </CardHeader>
      <CardContent>
        <Stepper
          steps={steps}
          currentStep="payment"
          orientation="horizontal"
          showConnector={false}
        />
      </CardContent>
    </Card>
  );
}

/**
 * Combined Demo - Menunjukkan semua variasi dalam satu halaman
 */
export default function StepperDemoPage() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Stepper Component Demo</h1>
        <p className="text-muted-foreground">
          Reusable step-by-step component dengan support horizontal dan vertical orientation.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <StepperHorizontalDemo />
        <StepperVerticalDemo />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <StepperNonClickableDemo />
        <StepperMinimalDemo />
      </div>
    </div>
  );
}
