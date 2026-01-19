import Image from "next/image";

const Header = () => {
  return (
    <header className="w-full h-16 bg-sidebar border-b">
      <div className="flex items-center h-full">
        <Image width={64} height={64} src="/logo.png" alt="Logo" />
        <div>
          <h5 className="text-base font-bold flex items-center">Routify</h5>
          <p className="text-sm">
            Dynamic Vehicle Routing Problem Simulation using OSRM
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
