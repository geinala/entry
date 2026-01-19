import { Button } from "@/app/_components/ui/button";
import { SignOutButton } from "@clerk/nextjs";

export default function HistoryPage() {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-4">
      <h1>Hallo! Ini Halaman History</h1>
      <SignOutButton>
        <Button variant="destructive">Sign Out</Button>
      </SignOutButton>
    </div>
  );
}
