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
import { useUserContext } from "@/app/_contexts/user.context";
import { GroupedMenuItem, MENU_ITEMS, MenuItem } from "@/common/constants/menu";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const checkIsMenuActive = (menuPath: string, currentPath: string) => {
  const path = currentPath.split("?")[0];
  return path === menuPath;
};

export default function AuthenticatedSidebar() {
  const { userDetails } = useUserContext();
  const role = userDetails?.role?.name;
  const pathname = usePathname();

  const isMenuActive = useMemo(() => {
    return (menuPath: string) => checkIsMenuActive(menuPath, pathname);
  }, [pathname]);

  const allowedSidebarMenus = useMemo(() => {
    return MENU_ITEMS.reduce(
      (acc, item) => {
        if ("groupLabel" in item) {
          const filteredSubItems = item.items.filter(
            (sub) => !sub.roles || sub.roles.includes(role || ""),
          );
          if (filteredSubItems.length > 0) {
            acc.push({ ...item, items: filteredSubItems });
          }
        } else {
          if (!item.roles || item.roles.includes(role || "")) {
            acc.push(item);
          }
        }
        return acc;
      },
      [] as (MenuItem | GroupedMenuItem)[],
    );
  }, [role]);

  return (
    <Sidebar containerClassName="z-999">
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
              <GroupedSidebarMenuWithLabel key={index} item={item} isMenuActive={isMenuActive} />
            );
          } else {
            return (
              <SidebarMenuWithoutLabel key={index} item={item} isActive={isMenuActive(item.path)} />
            );
          }
        })}
      </SidebarContent>
    </Sidebar>
  );
}

const GroupedSidebarMenuWithLabel = ({
  item,
  isMenuActive,
}: {
  item: GroupedMenuItem;
  isMenuActive: (menuPath: string) => boolean;
}) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{item.groupLabel}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {item.items.map((subItem, subIndex) => (
            <SidebarMenuItem key={subIndex}>
              <Link href={subItem.path}>
                <SidebarMenuButton isActive={isMenuActive(subItem.path)}>
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
};

const SidebarMenuWithoutLabel = ({ item, isActive }: { item: MenuItem; isActive: boolean }) => {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={item.path}>
              <SidebarMenuButton isActive={isActive}>
                {item.icon}
                {item.label}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
