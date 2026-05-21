"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { CreateSimulationConstraintsSchema } from "@/schemas/simulation.schema";
import { useForm } from "@tanstack/react-form";
import { Plus, Trash2 } from "lucide-react";
import { useStartSimulation } from "../_hooks/use-mutations";
import { useParams } from "next/navigation";

export const ConstraintsForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { id } = useParams();
  const { mutateAsync, isPending } = useStartSimulation();

  const form = useForm({
    validators: {
      onChangeAsyncDebounceMs: 500,
      onChange: CreateSimulationConstraintsSchema,
      onSubmit: CreateSimulationConstraintsSchema,
    },
    defaultValues: {
      vehiclesConstraints: [{ vehicleName: "", maxCapacity: 1 }],
      computationTimeLimit: 300,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync({
        simulationId: id as string,
        constraintsData: value,
      });
      onSuccess?.();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="vehiclesConstraints"
          mode="array"
          /* eslint-disable react/no-children-prop */
          children={(field) => (
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <FieldLabel>Vehicle Constraints ({field.state.value.length})</FieldLabel>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    field.insertValue(0, {
                      vehicleName: "",
                      maxCapacity: 1,
                    })
                  }
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Vehicle
                </Button>
              </div>

              <FieldDescription>
                Define the vehicles used in the simulation and their maximum carrying capacity.
              </FieldDescription>

              {/* Table */}
              <div className="h-80 overflow-y-auto rounded-lg border">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle Name</TableHead>
                      <TableHead className="w-40">Max Capacity (kg)</TableHead>
                      <TableHead className="w-16" />
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {field.state.value.map((_, i) => (
                      <TableRow key={i}>
                        {/* Vehicle Name */}
                        <TableCell className="align-top">
                          <form.Field
                            name={`vehiclesConstraints[${i}].vehicleName`}
                            children={(subField) => {
                              const isInvalid =
                                subField.state.meta.isTouched && !subField.state.meta.isValid;

                              return (
                                <Field data-invalid={isInvalid}>
                                  <Input
                                    value={subField.state.value}
                                    onChange={(e) => subField.setValue(e.target.value)}
                                    placeholder="Drone A"
                                    aria-invalid={isInvalid}
                                  />

                                  {isInvalid && <FieldError errors={subField.state.meta.errors} />}
                                </Field>
                              );
                            }}
                          />
                        </TableCell>

                        {/* Capacity */}
                        <TableCell className="align-top">
                          <form.Field
                            name={`vehiclesConstraints[${i}].maxCapacity`}
                            children={(subField) => {
                              const isInvalid =
                                subField.state.meta.isTouched && !subField.state.meta.isValid;

                              return (
                                <Field data-invalid={isInvalid}>
                                  <Input
                                    type="number"
                                    step="any"
                                    min={0}
                                    max={50}
                                    value={subField.state.value}
                                    onChange={(e) => subField.setValue(Number(e.target.value))}
                                    placeholder="0 - 50"
                                    aria-invalid={isInvalid}
                                  />

                                  {isInvalid && <FieldError errors={subField.state.meta.errors} />}
                                </Field>
                              );
                            }}
                          />
                        </TableCell>

                        {/* Delete */}
                        <TableCell className="text-center align-top">
                          {field.state.value.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => field.removeValue(i)}
                            >
                              <Trash2 className="text-destructive h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        />

        {/* Computation Time */}
        <form.Field
          name="computationTimeLimit"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Computation Time Limit (seconds)</FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min={300}
                  max={600}
                  value={field.state.value}
                  onChange={(e) => field.setValue(Number(e.target.value))}
                  placeholder="300 - 600"
                  aria-invalid={isInvalid}
                />

                <FieldDescription>Maximum time allowed for the simulation to run.</FieldDescription>

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <Button isLoading={isPending}>Save Constraints</Button>
      </FieldGroup>
    </form>
  );
};
