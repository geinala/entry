"use client";

import { useState } from "react";
import { Stepper, type StepItem } from "@/app/_components/ui/stepper";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { useStepNavigation } from "@/app/_hooks/use-step-navigation";
import { FileText, Settings, Users, CheckCircle2 } from "lucide-react";

/**
 * Contoh integrasi Stepper ke Simulation Creation
 * Sesuaikan dengan kebutuhan form Anda
 */

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
    label: "Review & Confirm",
    description: "Review and confirm submission",
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
];

// Step-specific form components (placeholder - sesuaikan dengan form Anda)
function BasicInfoStep() {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Simulation Name</label>
        <input
          type="text"
          placeholder="Enter simulation name"
          className="w-full mt-1 px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          placeholder="Enter simulation description"
          className="w-full mt-1 px-3 py-2 border rounded-md"
          rows={4}
        />
      </div>
    </div>
  );
}

function SettingsStep() {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Duration (minutes)</label>
        <input
          type="number"
          placeholder="Enter duration"
          className="w-full mt-1 px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Difficulty Level</label>
        <select className="w-full mt-1 px-3 py-2 border rounded-md">
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>
    </div>
  );
}

function ParticipantsStep() {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Number of Participants</label>
        <input
          type="number"
          placeholder="Enter number"
          className="w-full mt-1 px-3 py-2 border rounded-md"
          min="1"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Roles</label>
        <div className="space-y-2 mt-1">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Role 1
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Role 2
          </label>
        </div>
      </div>
    </div>
  );
}

function ReviewStep() {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm font-medium text-blue-900">
          ✓ Please review all information above before submitting
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium">Simulation Name</p>
          <p className="text-muted-foreground">Test Simulation</p>
        </div>
        <div>
          <p className="font-medium">Duration</p>
          <p className="text-muted-foreground">30 minutes</p>
        </div>
        <div>
          <p className="font-medium">Difficulty</p>
          <p className="text-muted-foreground">Medium</p>
        </div>
        <div>
          <p className="font-medium">Participants</p>
          <p className="text-muted-foreground">5 people</p>
        </div>
      </div>
    </div>
  );
}

// Render step content
function StepContent({ stepId }: { stepId: string }) {
  switch (stepId) {
    case "basic":
      return <BasicInfoStep />;
    case "settings":
      return <SettingsStep />;
    case "participants":
      return <ParticipantsStep />;
    case "review":
      return <ReviewStep />;
    default:
      return null;
  }
}

export function SimulationCreateWizard() {
  const navigation = useStepNavigation(simulationSteps, "basic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Simulation created successfully!");
      navigation.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = navigation.getProgress();

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">
            Step {navigation.currentIndex + 1} of {navigation.getTotalSteps()}
          </h2>
          <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stepper */}
      <Stepper
        steps={simulationSteps}
        currentStep={navigation.currentStep}
        orientation="horizontal"
        onStepChange={navigation.goToStep}
        clickableSteps={true}
      />

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {simulationSteps.find((s) => s.id === navigation.currentStep)?.label}
          </CardTitle>
          <CardDescription>
            {simulationSteps.find((s) => s.id === navigation.currentStep)?.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepContent stepId={navigation.currentStep} />

          {/* Navigation Buttons */}
          <div className="flex gap-3 justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={navigation.goToPrevious}
              disabled={navigation.isFirstStep}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={navigation.reset}
              >
                Reset
              </Button>

              {navigation.isLastStep ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Simulation"}
                </Button>
              ) : (
                <Button onClick={navigation.goToNext}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CreateSimulationPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Simulation</h1>
        <p className="text-muted-foreground">
          Follow the steps below to create a new simulation
        </p>
      </div>

      <SimulationCreateWizard />
    </div>
  );
}
