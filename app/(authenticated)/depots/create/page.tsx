"use client";

import Page from "@/app/_components/page";
import { CreateOrUpdateDepotForm } from "../_components/create-or-update.form";
import { Card, CardContent } from "@/app/_components/ui/card";
import { useCreateDepotMutation } from "./_hooks/use-mutations";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";

export default function CreateDepotPage() {
  const { mutateAsync, isPending } = useCreateDepotMutation();
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Depots", href: "/depots" },
      { label: "Create Depot", href: "/depots/create" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <Page title="Create Depot" description="Add a new depot to your simulation.">
      <Card className="h-full">
        <CardContent>
          <CreateOrUpdateDepotForm
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
