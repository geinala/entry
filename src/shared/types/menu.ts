import type { FileRoutesByPath } from "@tanstack/react-router";
import type { ReactNode } from "react";

export type TMenuItem = {
  label: string;
  icon: ReactNode;
  to?: FileRoutesByPath[keyof FileRoutesByPath]["path"];
  children?: TMenuItem[];
  requiredPermission?: string | string[] | null;
};
