import { integer, pgTable } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: integer("id").primaryKey(),
  // Define other columns here
});
