import { SidebarProvider } from "@/app/_components/ui/sidebar";
import Header from "./_components/header";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="w-full min-h-screen">
        <Header />
        {children}
      </div>
    </SidebarProvider>
  );
}
