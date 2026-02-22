"use client";

import { LayoutDashboard, Route, UserCog, Users } from "lucide-react";
import { Route as RouteNext } from "next";

export type TMenuItem = {
  label: string;
  path: RouteNext;
  icon: React.ReactNode;
  permissions?: string[];
};

export interface IGroupedMenuItem {
  groupLabel: string;
  items: TMenuItem[];
}

export const MENU_ITEMS: (TMenuItem | IGroupedMenuItem)[] = [
  {
    groupLabel: "Main Menu",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard />,
      },
      {
        label: "Simulations",
        path: "/simulations",
        icon: <Route />,
      },
    ],
  },
  {
    groupLabel: "Master Data",
    items: [
      {
        path: "/users",
        icon: <Users />,
        label: "User Management",
      },
      {
        path: "/users/waitlist",
        icon: <UserCog />,
        label: "Waitlist",
      },
    ],
  },
];
