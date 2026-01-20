import { findUserByClerkIdRepository } from "./user.repository";
import { UserType } from "./user.types";

export const validateUserService = async (clerkUserId: string) => {
  try {
    const user = await findUserByClerkIdRepository(clerkUserId);

    if (user) {
      return {
        type: UserType.EXISTING_USER,
        // TODO: return user role or other relevant info
      };
    }

    return null;
  } catch (error) {
    throw error;
  }
};
