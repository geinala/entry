"use client";

import { client, setupAuthInterceptor } from "@/lib/axios";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export type TAuthenticatedClient = ReturnType<typeof useAuthenticatedClient>;

export default function useAuthenticatedClient() {
  const { getToken } = useAuth();

  useEffect(() => {
    setupAuthInterceptor(getToken);
  }, [getToken]);

  return client;
}
