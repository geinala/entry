import { Sidebar, SidebarContent } from "@/app/_components/ui/sidebar";

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full min-h-screen grid grid-cols-[250px_1fr] relative">
      <Sidebar className="relative w-full">
        <SidebarContent>
          <div className="flex w-full h-full justify-center items-center">Sidebar</div>
        </SidebarContent>
      </Sidebar>
      <div className="w-full relative p-3">{children}</div>
    </main>
  );
}
