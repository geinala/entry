"use client";

import { LayoutDashboard, Route, Users } from "lucide-react";
import { Route as RouteNext } from "next";

export type MenuItem = {
  label: string;
  href: RouteNext;
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
        href: "/dashboard",
        roles: ["user", "admin"],
        icon: <LayoutDashboard />,
      },
      {
        label: "Simulations",
        href: "/simulations",
        roles: ["user"],
        icon: <Route />,
      },
    ],
  },
  {
    groupLabel: "Master Data",
    items: [
      {
        href: "/users",
        icon: <Users />,
        label: "User Management",
        roles: ["admin"],
      },
    ],
  },
];
