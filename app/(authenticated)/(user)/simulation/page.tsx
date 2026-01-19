import { Button } from "@/app/_components/ui/button";
import { SignOutButton } from "@clerk/nextjs";

export default function SimulationPage() {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-4">
      <h1>Hallo! Ini Halaman Simulation</h1>
      <SignOutButton>
        <Button variant="destructive">Sign Out</Button>
      </SignOutButton>
    </div>
  );
}
