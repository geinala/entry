import { Suspense } from "react";
import Loading from "@/app/_components/loading";
import { TicketClient } from "./_components/ticket-client";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.token;

  return (
    <Suspense fallback={<Loading />}>
      <TicketClient token={token} />
    </Suspense>
  );
}
