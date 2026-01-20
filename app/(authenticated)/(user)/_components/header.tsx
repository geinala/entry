import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import NotificationDropdown from "./notification.dropdown";
import DownloadTemplateButton from "./download-template.button";

const Header = () => {
  return (
    <header className="w-full h-16 bg-sidebar border-b flex justify-between items-center">
      <div className="flex items-center h-full">
        <Image width={64} height={64} src="/logo.png" alt="Logo" />
        <div>
          <h5 className="text-base font-bold flex items-center">Routify</h5>
          <p className="text-sm">
            Dynamic Vehicle Routing Problem Simulation using OSRM
          </p>
        </div>
      </div>
      <div className="flex gap-4 items-center px-4">
        <DownloadTemplateButton />
        <NotificationDropdown />
        <UserButton />
      </div>
    </header>
  );
};

export default Header;
