"use client";

import { SidebarProvider } from "../_components/ui/sidebar";
import { BreadcrumbProvider } from "../_contexts/breadcrumb.context";
import Header from "./_components/header";
import AuthenticatedSidebar from "./_components/sidebar";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
