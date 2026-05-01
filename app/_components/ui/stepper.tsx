"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

/**
 * Stepper component untuk menampilkan step-by-step progress
 * Generic dan reusable, support horizontal dan vertical orientation
 */

// ============================================================================
// VARIANT STYLES
// ============================================================================

const stepperContainerVariants = cva("flex gap-0", {
  variants: {
    orientation: {
      horizontal: "flex-row items-center",
      vertical: "flex-col items-start",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

const stepItemVariants = cva("flex items-center gap-3", {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col items-start",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

const stepIndicatorVariants = cva(
  "relative flex items-center justify-center shrink-0 w-10 h-10 rounded-full border-2 font-semibold text-sm transition-all duration-200",
  {
    variants: {
      state: {
        pending: "border-muted bg-muted text-muted-foreground",
        current:
          "border-primary bg-primary text-primary-foreground ring-2 ring-primary/30 shadow-sm",
        completed: "border-primary bg-primary text-primary-foreground shadow-sm",
      },
    },
    defaultVariants: {
      state: "pending",
    },
  },
);

const stepLabelVariants = cva("text-sm font-medium", {
  variants: {
    state: {
      pending: "text-foreground/60",
      current: "text-foreground font-semibold",
      completed: "text-foreground/80",
    },
  },
  defaultVariants: {
    state: "pending",
  },
});

const stepDescriptionVariants = cva("text-xs", {
  variants: {
    state: {
      pending: "text-muted-foreground",
      current: "text-muted-foreground",
      completed: "text-muted-foreground",
    },
  },
  defaultVariants: {
    state: "pending",
  },
});

export type StepperOrientation = "horizontal" | "vertical";
export type StepState = "pending" | "current" | "completed";

export interface StepItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface StepperProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof stepperContainerVariants> {
  steps: StepItem[];
  currentStep: string;
  onStepChange?: (stepId: string) => void;
  clickableSteps?: boolean;
  showConnector?: boolean;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      currentStep,
      orientation = "horizontal",
      onStepChange,
      clickableSteps = false,
      showConnector = true,
      className,
      ...props
    },
    ref,
  ) => {
    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

    return (
      <div
        ref={ref}
        className={cn(stepperContainerVariants({ orientation }), className)}
        {...props}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = step.id === currentStep;
          const state: StepState = isCompleted ? "completed" : isCurrent ? "current" : "pending";

          const isClickable = clickableSteps && !step.disabled;

          return (
            <div key={step.id} className="flex items-center gap-0">
              {/* Step Content */}
              <div
                className={cn(stepItemVariants({ orientation }), isClickable && "cursor-pointer")}
                onClick={() => {
                  if (isClickable && onStepChange) {
                    onStepChange(step.id);
                  }
                }}
              >
                {/* Indicator */}
                <div
                  className={cn(stepIndicatorVariants({ state }), isClickable && "hover:shadow-md")}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span className="select-none">{index + 1}</span>
                  )}
                </div>

                {/* Label & Description */}
                <div className="flex flex-col gap-0.5 select-none">
                  <label className={stepLabelVariants({ state })}>{step.label}</label>
                  {step.description && (
                    <p className={stepDescriptionVariants({ state })}>{step.description}</p>
                  )}
                </div>
              </div>

              {/* Connector */}
              {showConnector && index < steps.length - 1 && (
                <StepperConnector
                  orientation={orientation as StepperOrientation}
                  isCompleted={isCompleted || isCurrent}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  },
);

Stepper.displayName = "Stepper";

// ============================================================================
// STEPPER CONNECTOR
// ============================================================================

interface StepperConnectorProps {
  orientation: StepperOrientation;
  isCompleted?: boolean;
}

const StepperConnector = React.forwardRef<HTMLDivElement, StepperConnectorProps>(
  ({ orientation, isCompleted }, ref) => {
    return (
      <div ref={ref}>
        {orientation === "horizontal" ? (
          <div className="relative h-0.5 flex-1 min-w-12 mx-2 bg-muted">
            {isCompleted && (
              <div className="absolute inset-0 bg-primary transition-all duration-200" />
            )}
          </div>
        ) : (
          <div className="relative w-0.5 h-8 bg-muted ml-5">
            {isCompleted && (
              <div className="absolute inset-0 bg-primary transition-all duration-200" />
            )}
          </div>
        )}
      </div>
    );
  },
);

StepperConnector.displayName = "StepperConnector";

// ============================================================================
// EXPORTS
// ============================================================================

export { Stepper, StepperConnector };
