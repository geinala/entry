"use client";

import { Route } from "next";
import { PERMISSIONS, TPermission } from "./permissions";

type TPageAccessPermissions = {
  route: Route;
  permissions: TPermission[];
};

export const PAGE_ACCESS_PERMISSIONS: TPageAccessPermissions[] = [
  {
    route: "/users/waitlist",
    permissions: [PERMISSIONS.WAITLIST_VIEW],
  },
  {
    route: "/dashboard",
    permissions: [PERMISSIONS.DASHBOARD_VIEW],
  },
];
