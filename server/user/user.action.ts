"use server";

import { actionWrapper } from "@/lib/action";
import { createUserRepository, findUserByClerkIdRepository } from "./user.repository";
import { OnBoardingUserData } from "./user.schema";

export const createUserAction = async (data: OnBoardingUserData) => {
  return actionWrapper(async () => {
    return await createUserRepository(data);
  }, "User created successfully");
};

export const findUserByClerkIdAction = async (clerkUserId: string) => {
  return actionWrapper(async () => {
    return await findUserByClerkIdRepository(clerkUserId);
  }, "User found successfully");
};
