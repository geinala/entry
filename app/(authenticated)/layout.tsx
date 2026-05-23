"use client";

import { usePathname } from "next/navigation";
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
      <div className="w-full h-screen flex flex-col">
        <Header />
        <main className="w-full flex h-full overflow-hidden">
          <AuthenticatedSidebar />
          {children}
        </main>
      </div>
    </UserProvider>
  );
}
