"use client";

import { Route, Users, Warehouse, Wrench } from "lucide-react";
import { Route as RouteNext } from "next";

export type TMenuItem = {
  label: string;
  path: RouteNext;
  level?: number;
  icon: React.ReactNode;
};

export interface IGroupedMenuItem {
  groupLabel: string;
  level?: number;
  items: TMenuItem[];
}

export const MENU_ITEMS: (TMenuItem | IGroupedMenuItem)[] = [
  {
    groupLabel: "Main Menu",
    level: 1,
    items: [
      {
        label: "Simulations",
        path: "/simulations",
        icon: <Route />,
      },
    ],
  },
  {
    groupLabel: "Master Data",
    level: 2,
    items: [
      {
        path: "/users",
        icon: <Users />,
        label: "Users",
      },
      {
        path: "/depots",
        icon: <Warehouse />,
        label: "Depots",
      },
    ],
  },
  {
    groupLabel: "Configuration",
    level: 3,
    items: [
      {
        path: "/parameters",
        icon: <Wrench />,
        label: "Parameters",
      },
    ],
  },
];
