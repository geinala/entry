"use client";

import { client } from "@/lib/axios";
import { TWaitlistForm } from "@/schemas/waitlist.schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateWaitlistEntryMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: TWaitlistForm) => {
      return await client.post("/waitlist", payload);
    },
    onSuccess: () => {
      toast.success("Successfully joined the waitlist! Redirecting...", {
        duration: 1000,
        closeButton: false,
        dismissible: false,
        onAutoClose: () => {
          router.push("/");
        },
      });
    },
  });
};
