"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { Button } from "../_components/ui/button";

export default function Page() {
  return (
    <main className="w-dvw h-dvh flex justify-center items-center">
      <SignedOut>
        <SignInButton>
          <Button>Masuk</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton>
          <Button variant={"destructive"}>Keluar</Button>
        </SignOutButton>
      </SignedIn>
    </main>
  );
}
