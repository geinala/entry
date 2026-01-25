"use client";

import Link from "next/link";
import { Button } from "../_components/ui/button";
import { Route } from "next";

export default function Page() {
  return (
    <main className="w-dvw h-dvh flex justify-center items-center">
      <Link href={"/sign-in" as Route}>
        <Button>Masuk</Button>
      </Link>
    </main>
  );
}
