"use server";

import { db } from "@/lib/db";
import { InsertUserData } from "./user.schema";
import { userTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const createUserRepository = async (data: InsertUserData) => {
  try {
    return await db.insert(userTable).values(data).returning();
  } catch {
    throw new Error("Failed to create user");
  }
};

export const findUserByClerkIdRepository = async (clerkUserId: string) => {
  try {
    const user = await db
      .select({
        id: userTable.id,
      })
      .from(userTable)
      .where(eq(userTable.clerkUserId, clerkUserId))
      .limit(1);

    return user[0] || null;
  } catch {
    throw new Error("Failed to find user by Clerk ID");
  }
};
