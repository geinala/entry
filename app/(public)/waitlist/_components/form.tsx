"use client";

/* eslint-disable react/no-children-prop */

import Logo from "@/app/_components/logo";
import { Paragraph, Title } from "@/app/_components/typography";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/app/_components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { WaitlistFormSchema } from "@/schemas/waitlist.schema";
import { useCreateWaitlistEntryMutation } from "../_hooks/use-mutations";

export const WaitlistForm = () => {
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
    },
  });

  return (
    <Card className="w-md justify-center">
      <CardHeader className="justify-center items-center flex flex-col text-center">
        <Logo width={50} height={50} />
        <Title level={4}>Get Early Access</Title>
        <Paragraph>
          Join our exclusive waitlist and be among the first to experience our platform.
        </Paragraph>
      </CardHeader>
      <CardContent className="justify-center items-center flex flex-col w-full">
        <form
          className="flex flex-col w-full gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="grid grid-cols-2 gap-3">
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
          <FieldGroup>
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
              Request Access
            </Button>
          </Field>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col text-center">
        <Paragraph>
          Returning user?{" "}
          <Link href={"/sign-in"} className="text-primary font-semibold hover:underline">
            Login now
          </Link>
        </Paragraph>
      </CardFooter>
    </Card>
  );
};
