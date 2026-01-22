"use client";

import Logo from "@/app/_components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/app/_components/ui/sidebar";
// import { useUserContext } from "@/app/_contexts/user.context";
import { GroupedMenuItem, MENU_ITEMS, MenuItem } from "@/common/constants/menu";
import { X } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function AuthenticatedSidebar() {
  // const { userDetails } = useUserContext();
  const role = "user";

  const allowedSidebarMenus = useMemo(() => {
    return MENU_ITEMS.map((item: MenuItem | GroupedMenuItem) => {
      if ("groupLabel" in item) {
        const filteredItems = item.items.filter(
          (menuItem: MenuItem) => !menuItem.roles || menuItem.roles.includes(role || ""),
        );

        return {
          ...item,
          items: filteredItems,
        };
      }

      return item;
    }).filter((item) => {
      if ("groupLabel" in item) {
        return item.items.length > 0;
      }

      return !item.roles || item.roles.includes(role || "");
    });
  }, [role]);

  return (
    <Sidebar>
      <SidebarHeader className="flex justify-between items-center flex-row p-4">
        <Logo />
        <SidebarTrigger variant={"ghost"}>
          <X />
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent>
        {allowedSidebarMenus.map((item, index) => {
          if ("groupLabel" in item) {
            return (
              <SidebarGroup key={index}>
                <SidebarGroupLabel>{item.groupLabel}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem, subIndex) => (
                      <SidebarMenuItem key={subIndex}>
                        <Link href={subItem.href}>
                          <SidebarMenuButton>
                            {subItem.icon}
                            {subItem.label}
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          } else {
            return (
              <SidebarGroup key={index}>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <Link href={item.href}>
                        <SidebarMenuButton>
                          {item.icon}
                          {item.label}
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          }
        })}
      </SidebarContent>
    </Sidebar>
  );
}
