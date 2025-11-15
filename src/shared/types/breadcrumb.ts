import type { FileRoutesByPath } from "@tanstack/react-router";

export type TBreadcrumbItem = {
  label: string;
  path: FileRoutesByPath[keyof FileRoutesByPath]["path"];
};
