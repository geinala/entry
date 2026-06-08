"use client";

import Page from "@/app/_components/page";
import { useParams } from "next/navigation";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";

export default function DepotPage() {
  const { id } = useParams<{ id: string }>();
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Parameters", href: "/parameters" },
      { label: "Parameter Detail", href: `/parameters/${id}` },
    ]);
  }, [setBreadcrumbs, id]);

  return <Page title="Parameter Detail" description={`Details parameter.`}></Page>;
}
