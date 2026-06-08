"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/_components/ui/field";
import { UseCreateSimulationFormReturn } from "../_hooks/use-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { optimizationAlgorithmEnum } from "@/drizzle/schema";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { snakeToText, toTitleCase } from "@/lib/utils";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { useEffect, useState } from "react";

interface AdvanceConfigFormDialogProps {
  form: UseCreateSimulationFormReturn;
  onSave?: () => void;
}

export const AdvanceConfigFormDialog = ({ form, onSave }: AdvanceConfigFormDialogProps) => {
  const [draftValues, setDraftValues] = useState(form.state.values);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setDraftValues(form.state.values);
  }, [form.state.values]);

  const updateDraft = <K extends keyof typeof draftValues>(
    key: K,
    value: (typeof draftValues)[K],
  ) => {
    setDraftValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    const draftKeys = Object.keys(draftValues) as Array<keyof typeof draftValues>;

    draftKeys.forEach((key) => {
      form.setFieldValue(key, draftValues[key]);
    });

    await form.validateAllFields("submit");

    const hasErrors = draftKeys.some((key) => {
      const fieldMeta = form.state.fieldMeta[key];
      return fieldMeta?.errors && fieldMeta.errors.length > 0;
    });

    if (!hasErrors) {
      onSave?.();
    }
  };

  const isGoogleOrTools = draftValues.algorithm === "google_or_tools";
  const isResequenceEnabled = draftValues.enableResequence;

  return (
    <DialogContent className="min-w-[50vw]">
      <DialogHeader>
        <DialogTitle>Advance Configuration</DialogTitle>
        <DialogDescription>Configure the advanced settings for your simulation.</DialogDescription>
      </DialogHeader>

      <FieldGroup>
        <form.Field name="algorithm">
          {(field) => (
            <Field>
              <FieldLabel>Algorithm</FieldLabel>
              <FieldDescription>
                Choose the optimization strategy used during route calculation.
              </FieldDescription>
              <Select
                value={draftValues.algorithm}
                onValueChange={(value) =>
                  updateDraft("algorithm", value as typeof draftValues.algorithm)
                }
              >
                <SelectTrigger id="algorithm" className="w-full">
                  <SelectValue placeholder="Select an algorithm" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {optimizationAlgorithmEnum.enumValues.map((algorithm) => (
                    <SelectItem key={algorithm} value={algorithm}>
                      {toTitleCase(snakeToText(algorithm))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        <FieldGroup className="grid grid-cols-2">
          <form.Field name="congestionDelayThresholdInSeconds">
            {(field) => (
              <Field>
                <FieldLabel>Congestion Delay Threshold (seconds)</FieldLabel>
                <FieldDescription>
                  Minimum delay (seconds) before traffic is considered congestion.
                </FieldDescription>
                <Input
                  type="number"
                  value={draftValues.congestionDelayThresholdInSeconds}
                  onChange={(e) =>
                    updateDraft("congestionDelayThresholdInSeconds", Number(e.target.value))
                  }
                  className="w-full mt-auto"
                  disabled={!isResequenceEnabled}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="resequenceImprovementThresholdPercent">
            {(field) => (
              <Field>
                <FieldLabel>Resequence Improvement Threshold (%)</FieldLabel>
                <FieldDescription>
                  Minimum percentage improvement required before resequencing is applied.
                </FieldDescription>
                <Input
                  type="number"
                  step="0.1"
                  value={draftValues.resequenceImprovementThresholdPercent}
                  onChange={(e) =>
                    updateDraft("resequenceImprovementThresholdPercent", Number(e.target.value))
                  }
                  disabled={!isResequenceEnabled}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        {!isGoogleOrTools && (
          <>
            <FieldGroup className="grid grid-cols-2">
              <form.Field name="diversificationStrength">
                {(field) => (
                  <Field>
                    <FieldLabel>Diversification Strength</FieldLabel>
                    <FieldDescription>
                      Controls how aggressively the algorithm explores new solutions.
                    </FieldDescription>
                    <Input
                      type="number"
                      step="0.1"
                      value={draftValues.diversificationStrength}
                      onChange={(e) =>
                        updateDraft("diversificationStrength", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="diversifyAfterIterations">
                {(field) => (
                  <Field>
                    <FieldLabel>Diversify After Iterations</FieldLabel>
                    <FieldDescription>
                      Apply diversification after this many iterations without progress.
                    </FieldDescription>
                    <Input
                      type="number"
                      value={draftValues.diversifyAfterIterations}
                      onChange={(e) =>
                        updateDraft("diversifyAfterIterations", Number(e.target.value))
                      }
                      className="w-full mt-auto"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>

            <FieldGroup className="grid grid-cols-2">
              <form.Field name="earlyStopNoImprovementIterations">
                {(field) => (
                  <Field>
                    <FieldLabel>Early Stop No Improvement Iterations</FieldLabel>
                    <FieldDescription>
                      Stop optimization early if no better solution is found.
                    </FieldDescription>
                    <Input
                      type="number"
                      value={draftValues.earlyStopNoImprovementIterations}
                      onChange={(e) =>
                        updateDraft("earlyStopNoImprovementIterations", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              {/* Neighbors */}
              <form.Field name="maxNeighbors2Opt">
                {(field) => (
                  <Field>
                    <FieldLabel>Max Neighbors 2-Opt</FieldLabel>
                    <FieldDescription>
                      Maximum candidate moves evaluated using 2-opt.
                    </FieldDescription>
                    <Input
                      type="number"
                      value={draftValues.maxNeighbors2Opt}
                      onChange={(e) => updateDraft("maxNeighbors2Opt", Number(e.target.value))}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="randomSeed">
                {(field) => (
                  <Field>
                    <FieldLabel>Random Seed</FieldLabel>
                    <FieldDescription>
                      Use a fixed value to reproduce the same optimization results.
                    </FieldDescription>
                    <Input
                      type="number"
                      value={draftValues.randomSeed}
                      onChange={(e) => updateDraft("randomSeed", Number(e.target.value))}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              {/* Tabu */}
              <form.Field name="tabuIterations">
                {(field) => (
                  <Field>
                    <FieldLabel>Tabu Iterations</FieldLabel>
                    <FieldDescription>Maximum optimization iterations allowed.</FieldDescription>
                    <Input
                      type="number"
                      value={draftValues.tabuIterations}
                      onChange={(e) => updateDraft("tabuIterations", Number(e.target.value))}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="tabuTenure">
                {(field) => (
                  <Field className="col-span-2">
                    <FieldLabel>Tabu Tenure</FieldLabel>
                    <FieldDescription>
                      How long a move remains forbidden in the tabu list.
                    </FieldDescription>
                    <Input
                      type="number"
                      value={draftValues.tabuTenure}
                      onChange={(e) => updateDraft("tabuTenure", Number(e.target.value))}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>

            <form.Field name="enableAspiration">
              {(field) => (
                <Field>
                  <Label className="flex items-center gap-2">
                    <Checkbox
                      checked={draftValues.enableAspiration}
                      onCheckedChange={(checked) =>
                        updateDraft("enableAspiration", Boolean(checked))
                      }
                    />
                    Enable Aspiration
                  </Label>
                  <FieldDescription>
                    Allow tabu moves if they produce a significantly better solution.
                  </FieldDescription>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          </>
        )}

        <form.Field name="enableResequence">
          {(field) => (
            <Field>
              <Label className="flex items-center gap-2">
                <Checkbox
                  checked={isResequenceEnabled}
                  onCheckedChange={(checked) => updateDraft("enableResequence", Boolean(checked))}
                />
                Enable Resequence
              </Label>
              <FieldDescription>Enable route reordering during reoptimization.</FieldDescription>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="button" onClick={handleSave}>
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
