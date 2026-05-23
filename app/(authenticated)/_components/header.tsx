"use client";

import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "@/app/_components/ui/sidebar";
import Logo from "@/app/_components/logo";
import Breadcrumb from "./breadcrumb";

const Header = () => {
  return (
    <header className="w-full h-16 bg-sidebar border-b flex justify-between items-center p-3">
      <div className="flex items-center gap-3 h-fit">
        <SidebarTrigger />
        <Logo />
        <Breadcrumb />
      </div>
      <div className="flex gap-3 items-center">
        <UserButton />
      </div>
    </header>
  );
};

export default Header;
