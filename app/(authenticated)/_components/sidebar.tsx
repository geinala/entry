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
import { IGroupedMenuItem, MENU_ITEMS, TMenuItem } from "@/common/constants/menu";
import { clientCheckPermissions } from "@/lib/permission";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const checkIsMenuActive = (menuPath: string, currentPath: string) => {
  const path = currentPath.split("?")[0];
  return path === menuPath;
};

export default function AuthenticatedSidebar() {
  const { permissions } = useUserContext();
  const pathname = usePathname();

  const isMenuActive = useMemo(() => {
    return (menuPath: string) => checkIsMenuActive(menuPath, pathname);
  }, [pathname]);

  const allowedSidebarMenus = useMemo(() => {
    if (!permissions) return [];

    const filtered = MENU_ITEMS.reduce(
      (acc, item) => {
        if ("groupLabel" in item) {
          const filteredSubItems = item.items.filter((sub) =>
            clientCheckPermissions(permissions, sub.permissions ?? []),
          );
          // Only add group if it has items after filtering
          if (filteredSubItems.length > 0) {
            acc.push({ ...item, items: filteredSubItems });
          }
        } else {
          if (!item.permissions || clientCheckPermissions(permissions, item.permissions)) {
            acc.push(item);
          }
        }
        return acc;
      },
      [] as (TMenuItem | IGroupedMenuItem)[],
    );

    // Sort by level (ascending), treating undefined as 0
    return filtered.sort((a, b) => {
      const levelA = a.level ?? 0;
      const levelB = b.level ?? 0;
      return levelA - levelB;
    });
  }, [permissions]);

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
  item: IGroupedMenuItem;
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

const SidebarMenuWithoutLabel = ({ item, isActive }: { item: TMenuItem; isActive: boolean }) => {
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
