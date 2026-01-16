import { SignOutButton } from "@clerk/nextjs";

export default function HistoryPage() {
  return (
    <main className="w-dvw h-dvh flex justify-center items-center">
      <h1 className="text-2xl font-bold">
        Halaman Riwayat (Autentikasi Diperlukan)
      </h1>
      <SignOutButton>Sign Out</SignOutButton>
    </main>
  );
}
