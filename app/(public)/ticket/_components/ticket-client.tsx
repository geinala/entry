"use client";

import Loading from "@/app/_components/loading";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ticketMutations } from "../_api/mutations";

interface TicketClientProps {
  token?: string;
}

export function TicketClient({ token }: TicketClientProps) {
  const router = useRouter();

  const hasExecuted = useRef(false);

  const { mutateAsync } = useMutation({
    ...ticketMutations.acceptTicket,
    onSuccess: () => {
      router.replace("/sign-in");
    },
    onError: () => {
      router.replace("/sign-in");
    },
  });

  useEffect(() => {
    if (!token) {
      router.replace("/sign-in");
      return;
    }

    if (hasExecuted.current) {
      return;
    }
    hasExecuted.current = true;

    mutateAsync(token);
  }, [token, mutateAsync, router]);

  return <Loading />;
}
