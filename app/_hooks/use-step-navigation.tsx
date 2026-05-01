"use client";

import { useCallback, useState } from "react";
import type { StepItem } from "@/app/_components/ui/stepper";

/**
 * Custom hook untuk step navigation management
 * Menyediakan fungsi-fungsi common untuk navigasi antar steps
 */

interface UseStepNavigationOptions {
  onStepChange?: (stepId: string) => void;
  persistKey?: string; // Optional: untuk persist ke localStorage
}

export function useStepNavigation(
  steps: StepItem[],
  initialStep?: string,
  options?: UseStepNavigationOptions
) {
  // Jika persistKey ada, coba load dari localStorage
  const getInitialStep = (): string => {
    if (options?.persistKey) {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(options.persistKey);
        if (saved && steps.some((s) => s.id === saved)) {
          return saved;
        }
      }
    }
    return initialStep || steps[0]?.id || "";
  };

  const [currentStep, setCurrentStep] = useState<string>(getInitialStep());

  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  // Persist ke localStorage jika ada key
  const updateStep = useCallback(
    (stepId: string) => {
      if (steps.some((s) => s.id === stepId)) {
        setCurrentStep(stepId);
        options?.persistKey &&
          localStorage.setItem(options.persistKey, stepId);
        options?.onStepChange?.(stepId);
      }
    },
    [steps, options]
  );

  const goToNext = useCallback(() => {
    if (currentIndex < steps.length - 1) {
      updateStep(steps[currentIndex + 1].id);
    }
  }, [currentIndex, steps, updateStep]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      updateStep(steps[currentIndex - 1].id);
    }
  }, [currentIndex, steps, updateStep]);

  const goToStep = useCallback(
    (stepId: string) => {
      const step = steps.find((s) => s.id === stepId);
      if (step && !step.disabled) {
        updateStep(stepId);
      }
    },
    [steps, updateStep]
  );

  const jumpToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < steps.length) {
        updateStep(steps[stepIndex].id);
      }
    },
    [steps, updateStep]
  );

  const reset = useCallback(() => {
    const initial = initialStep || steps[0]?.id || "";
    updateStep(initial);
  }, [steps, initialStep, updateStep]);

  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;
  const isStepCompleted = (stepId: string) => {
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    return stepIndex < currentIndex;
  };

  return {
    // State
    currentStep,
    currentIndex,
    isFirstStep,
    isLastStep,

    // Methods
    goToNext,
    goToPrevious,
    goToStep,
    jumpToStep,
    reset,
    isStepCompleted,

    // Utility
    getTotalSteps: () => steps.length,
    getProgress: () => ((currentIndex + 1) / steps.length) * 100,
  };
}

/**
 * Hook untuk form wizard dengan validation
 */
interface UseStepWizardOptions extends UseStepNavigationOptions {
  validateStep?: (stepId: string) => Promise<boolean> | boolean;
  onComplete?: () => void;
}

export function useStepWizard(
  steps: StepItem[],
  initialStep?: string,
  options?: UseStepWizardOptions
) {
  const navigation = useStepNavigation(steps, initialStep, options);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateAndMove = useCallback(
    async (nextStepId: string) => {
      if (isValidating) return false;

      setIsValidating(true);
      try {
        // Validasi step saat ini
        if (options?.validateStep) {
          const isValid = await options.validateStep(navigation.currentStep);
          if (!isValid) {
            setErrors({
              [navigation.currentStep]: "Please complete this step",
            });
            setIsValidating(false);
            return false;
          }
        }

        setErrors({});
        const nextIndex = steps.findIndex((s) => s.id === nextStepId);
        if (nextIndex !== -1) {
          navigation.goToStep(nextStepId);
        }
        return true;
      } catch (error) {
        setErrors({
          [navigation.currentStep]:
            error instanceof Error ? error.message : "Validation failed",
        });
        return false;
      } finally {
        setIsValidating(false);
      }
    },
    [navigation, options, isValidating, steps]
  );

  const safeGoToNext = useCallback(async () => {
    if (navigation.isLastStep) {
      if (options?.validateStep) {
        const isValid = await options.validateStep(navigation.currentStep);
        if (isValid) {
          options.onComplete?.();
        }
      } else {
        options?.onComplete?.();
      }
      return;
    }

    const nextStepId = steps[navigation.currentIndex + 1]?.id;
    if (nextStepId) {
      await validateAndMove(nextStepId);
    }
  }, [
    navigation,
    steps,
    validateAndMove,
    options,
  ]);

  const safeGoToPrevious = useCallback(() => {
    navigation.goToPrevious();
  }, [navigation]);

  const clearError = useCallback((stepId?: string) => {
    if (stepId) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[stepId];
        return newErrors;
      });
    } else {
      setErrors({});
    }
  }, []);

  return {
    ...navigation,
    errors,
    isValidating,
    validateAndMove,
    safeGoToNext,
    safeGoToPrevious,
    clearError,
  };
}

/**
 * Hook untuk multi-step form dengan data persistence
 */
export function useStepForm<T extends Record<string, any>>(
  steps: StepItem[],
  initialData?: Partial<T>,
  persistKey?: string
) {
  const navigation = useStepNavigation(steps, undefined, { persistKey });
  const [formData, setFormData] = useState<Partial<T>>(initialData || {});

  const updateFormData = useCallback((data: Partial<T>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));

    if (persistKey) {
      localStorage.setItem(
        `${persistKey}-data`,
        JSON.stringify({ ...formData, ...data })
      );
    }
  }, [formData, persistKey]);

  const resetForm = useCallback(() => {
    setFormData(initialData || {});
    if (persistKey) {
      localStorage.removeItem(`${persistKey}-data`);
    }
    navigation.reset();
  }, [navigation, initialData, persistKey]);

  return {
    ...navigation,
    formData,
    updateFormData,
    resetForm,
  };
}
