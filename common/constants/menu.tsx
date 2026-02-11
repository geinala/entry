"use client";

import { LayoutDashboard, Route, UserCog, Users } from "lucide-react";
import { Route as RouteNext } from "next";

export type MenuItem = {
  label: string;
  path: RouteNext;
  icon: React.ReactNode;
  roles?: string[];
};

export interface GroupedMenuItem {
  groupLabel: string;
  items: MenuItem[];
}

export const MENU_ITEMS: (MenuItem | GroupedMenuItem)[] = [
  {
    groupLabel: "Main Menu",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        roles: ["user", "admin"],
        icon: <LayoutDashboard />,
      },
      {
        label: "Simulations",
        path: "/simulations",
        roles: ["user"],
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
        roles: ["admin"],
      },
      {
        path: "/users/waitlist",
        icon: <UserCog />,
        label: "Waitlist",
        roles: ["admin"],
      },
    ],
  },
];
