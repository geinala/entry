"use client";

import AdminDashboardView from "./_components/admin-dashboard.view";
import UserDashboardView from "./_components/user-dashboard.view";
import { useUserContext } from "@/app/_contexts/user.context";

export default function DashboardPage() {
  const { isAdmin } = useUserContext();

  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-4">
      {isAdmin ? <AdminDashboardView /> : <UserDashboardView />}
    </div>
  );
}
