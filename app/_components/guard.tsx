"use client";

import { useMemo } from "react";
import { useUserContext } from "../_contexts/user.context";
import { clientCheckPermissions } from "@/lib/permission";
import { usePathname } from "next/navigation";
import { PAGE_ACCESS_PERMISSIONS } from "@/common/constants/permissions/page-access";
import { Unauthorized } from "./unauthorized";

interface Props {
  children: React.ReactNode;
  requirePermission?: string;
}

export const GuardPage = ({ children, requirePermission }: Props) => {
  const { permissions } = useUserContext();
  const pathname = usePathname();

  const pageAccessConfig = useMemo(() => {
    return PAGE_ACCESS_PERMISSIONS.find((pageAccess) => pageAccess.route === pathname);
  }, [pathname]);

  const hasPermission = useMemo(() => {
    if (!pageAccessConfig && !requirePermission) return true;

    const requiredPerms = pageAccessConfig?.permissions ?? [];

    if (requirePermission) {
      requiredPerms.push(requirePermission as never);
    }

    if (!permissions || requiredPerms.length === 0) return true;

    return clientCheckPermissions(
      permissions,
      requiredPerms.map((p) => p as string),
    );
  }, [permissions, pageAccessConfig, requirePermission]);

  if (!hasPermission) {
    return <Unauthorized />;
  }

  return <>{children}</>;
};
