"use client";

import useUser from "@/app/_hooks/use-user";
import AdminDashboardView from "./_components/admin-dashboard.view";
import UserDashboardView from "./_components/user-dashboard.view";

export default function DashboardPage() {
  const { isAdmin } = useUser();

  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-4">
      {isAdmin ? <AdminDashboardView /> : <UserDashboardView />}
    </div>
  );
}
