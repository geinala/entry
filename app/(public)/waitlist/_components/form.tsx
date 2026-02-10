"use client";

/* eslint-disable react/no-children-prop */

import Logo from "@/app/_components/logo";
import { Paragraph, Title } from "@/app/_components/typography";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/app/_components/ui/card";
import { Field, FieldError, FieldGroup } from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { WaitlistFormSchema } from "@/server/waitlist/waitlist.schema";
import { useCreateWaitlistEntryMutation } from "../_hooks/use-mutations";
import { useEffect } from "react";

export const WaitlistForm = () => {
  const { mutateAsync } = useCreateWaitlistEntryMutation();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
    validators: { onSubmit: WaitlistFormSchema },
    onSubmit: async (values) => {
      await mutateAsync(values.value);
    },
  });

  useEffect(() => {
    console.log(form.state);
  }, [form.state]);

  return (
    <Card className="min-w-96 justify-center">
      <CardHeader className="justify-center items-center flex flex-col text-center">
        <Logo width={50} height={50} />
        <Title level={4}>Get Early Access</Title>
        <Paragraph>
          Join our exclusive waitlist and be among the first to experience our platform.
        </Paragraph>
      </CardHeader>
      <CardContent className="justify-center items-center flex flex-col">
        <form
          className="max-w-xs flex flex-col w-full gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const { isTouched, isValid, errors } = field.state.meta;

                const isInvalid = isTouched && !isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter your full name"
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
