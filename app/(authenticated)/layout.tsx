"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "../_components/ui/sidebar";
import { BreadcrumbProvider } from "../_contexts/breadcrumb.context";
import Header from "./_components/header";
import AuthenticatedSidebar from "./_components/sidebar";
import { UserProvider } from "../_contexts/user.context";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();

  const withoutHeaderPaths = ["/onboarding"];

  if (withoutHeaderPaths.includes(pathName)) {
    return <>{children}</>;
  }

  return (
    <UserProvider>
      <BreadcrumbProvider>
        <SidebarProvider defaultOpen={false}>
          <div className="w-full h-screen flex flex-col">
            <Header />
            <main className="h-full w-full flex">
              <AuthenticatedSidebar />
              {children}
            </main>
          </div>
        </SidebarProvider>
      </BreadcrumbProvider>
    </UserProvider>
  );
}
