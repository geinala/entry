"use client";

import { createUserAction } from "@/server/user/user.action";
import { InsertUserData } from "@/server/user/user.schema";

export const useUserOnboard = () => {
  const onboardUser = async (data: InsertUserData, onSuccess: () => void, onError: () => void) => {
    const result = await createUserAction(data);

    if (result.success) {
      onSuccess();
    } else {
      onError();
    }
  };

  return { onboardUser };
};
