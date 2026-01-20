"use client";

import { useUser as useClerkUser } from "@clerk/nextjs";

type ReturnUser = {
  clerkUser: ReturnType<typeof useClerkUser>;
  isAdmin: boolean;
};

export default function useUser(): ReturnUser {
  const clerkUser = useClerkUser();
  const isAdmin = true;

  return { clerkUser, isAdmin };
}
