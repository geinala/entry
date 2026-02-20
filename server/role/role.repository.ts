import { roleTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export const getRoleByNameRepository = async (name: string) => {
  return await db.select().from(roleTable).where(eq(roleTable.name, name)).limit(1);
};
