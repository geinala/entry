"use client";

import Page from "@/app/_components/page";
import { Card, CardContent } from "@/app/_components/ui/card";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";
import { useUpdateDepotMutation } from "./_hooks/use-mutations";
import { CreateOrUpdateDepotForm } from "../../_components/create-or-update.form";
import { useParams } from "next/navigation";
import { useGetDepotByIdQuery } from "../../_hooks/use-queries";

export default function UpdateDepotPage() {
  const { id } = useParams<{ id: string }>();
  const { mutateAsync, isPending } = useUpdateDepotMutation();
  const { setBreadcrumbs } = useBreadcrumb();
  const { data, isLoading } = useGetDepotByIdQuery(parseInt(id));

  useEffect(() => {
    setBreadcrumbs([
      { label: "Depots", href: "/depots" },
      { label: "Update Depot", href: `/depots/${id}/update` },
    ]);
  }, [setBreadcrumbs]);

  return (
    <Page
      title="Update Depot"
      description="Update an existing depot in your simulation."
      isLoading={isLoading}
    >
      <Card className="h-full">
        <CardContent>
          <CreateOrUpdateDepotForm
            defaultValues={data}
            isLoading={isPending}
            onSubmit={async (data) => {
              return await mutateAsync({ id: parseInt(id), data });
            }}
          />
        </CardContent>
      </Card>
    </Page>
  );
}
