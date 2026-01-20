"use client";

import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([{ label: "History", href: "/history" }]);
  }, [setBreadcrumbs]);

  return (
    <>
      <section className="h-full flex w-full">
        <div className="w-full p-3">{children}</div>
      </section>
    </>
  );
}
