"use client";

import { LayoutDashboard, Route, UserCog, Users } from "lucide-react";
import { Route as RouteNext } from "next";
import { PERMISSIONS } from "./permissions/permissions";

export type TMenuItem = {
  label: string;
  path: RouteNext;
  level?: number;
  icon: React.ReactNode;
  permissions?: string[];
};

export interface IGroupedMenuItem {
  groupLabel: string;
  level?: number;
  items: TMenuItem[];
}

export const MENU_ITEMS: (TMenuItem | IGroupedMenuItem)[] = [
  {
    groupLabel: "Main Menu",
    level: 2,
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard />,
        permissions: ["dashboard:view"], // TODO: Replace with actual permission constants
      },
      {
        label: "Simulations",
        path: "/simulations",
        icon: <Route />,
        permissions: ["simulation:view"], // TODO: Replace with actual permission constants
      },
    ],
  },
  {
    groupLabel: "Master Data",
    level: 1,
    items: [
      {
        path: "/users",
        icon: <Users />,
        label: "Users",
        permissions: ["user:view"], // TODO: Replace with actual permission constants
      },
      {
        path: "/users/waitlist",
        icon: <UserCog />,
        label: "Waitlist Users",
        permissions: [PERMISSIONS.WAITLIST_VIEW],
      },
    ],
  },
];
