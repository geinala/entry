"use client";

import { usePathname } from "next/navigation";
import Header from "./_components/header";
import AuthenticatedSidebar from "./_components/sidebar";
import useGetCurrentUser from "../_hooks/use-get-user";
import Loading from "../_components/loading";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useGetCurrentUser();
  const pathName = usePathname();

  const withoutHeaderPaths = ["/onboarding"];

  if (withoutHeaderPaths.includes(pathName)) {
    return <>{children}</>;
  }

  if (isLoading) return <Loading isFullscreen />;

  return (
    <div className="w-full h-screen flex flex-col">
      <Header />
      <main className="w-full flex h-full overflow-hidden">
        <AuthenticatedSidebar />
        {children}
      </main>
    </div>
  );
}
