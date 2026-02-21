import { Button } from "@/app/_components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import { WaitlistFormSchema } from "@/schemas/waitlist.schema";
import { useForm } from "@tanstack/react-form";
import { useCreateWaitlistEntryMutation } from "../_hooks/use-mutations";

/* eslint-disable react/no-children-prop */

interface Props {
  onSuccess?: () => void;
}

export const CreateWaitlistEntryForm = ({ onSuccess }: Props) => {
  const { mutateAsync } = useCreateWaitlistEntryMutation();

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    validators: { onSubmit: WaitlistFormSchema },
    onSubmit: async (values) => {
      await mutateAsync(values.value);
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
      <FieldGroup className="grid grid-cols-2 gap-2 mb-3">
        <form.Field
          name="firstName"
          children={(field) => {
            const { isTouched, isValid, errors } = field.state.meta;

            const isInvalid = isTouched && !isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Enter your first name"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="lastName"
          children={(field) => {
            const { isTouched, isValid, errors } = field.state.meta;

            const isInvalid = isTouched && !isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Enter your last name"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
      <FieldGroup className="mb-3">
        <form.Field
          name="email"
          children={(field) => {
            const { isTouched, isValid, errors } = field.state.meta;

            const isInvalid = isTouched && !isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Enter your email address"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
      <Field>
        <Button
          type="submit"
          className="w-full"
          disabled={form.state.isSubmitting || form.state.isSubmitSuccessful}
          isLoading={form.state.isSubmitting || form.state.isSubmitSuccessful}
        >
          Invite User
        </Button>
      </Field>
    </form>
  );
};
