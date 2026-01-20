"use client";

import { findUserByClerkIdAction } from "@/server/user/user.action";

export const useCheckUser = () => {
  const checkUser = async (
    clerkUserId: string,
    redirectOnSuccess: () => void,
  ): Promise<boolean> => {
    const response = await findUserByClerkIdAction(clerkUserId);

    if (response.success && response.data) {
      redirectOnSuccess();
      return true;
    }

    // TODO: Handle error case if needed
    return false;
  };

  return { checkUser };
};
