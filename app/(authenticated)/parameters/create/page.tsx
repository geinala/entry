"use client";

import Page from "@/app/_components/page";
import { Card, CardContent } from "@/app/_components/ui/card";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";
import { useCreateParameterMutation } from "./_hooks/use-mutations";
import { CreateParameterForm } from "../_components/create.form";

export default function CreateParameterPage() {
  const { mutateAsync, isPending } = useCreateParameterMutation();
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Parameters", href: "/parameters" },
      { label: "Create Parameter", href: "/parameters/create" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <Page title="Create Parameter" description="Add a new parameter to your simulation.">
      <Card className="h-full">
        <CardContent>
          <CreateParameterForm
            isLoading={isPending}
            onSubmit={async (data) => {
              return await mutateAsync(data);
            }}
          />
        </CardContent>
      </Card>
    </Page>
  );
}
