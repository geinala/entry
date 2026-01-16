import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: serial().primaryKey(),
  clerkUserId: varchar("clerk_user_id").notNull(),
  email: varchar("email").notNull().unique(),
  fullName: varchar("full_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
