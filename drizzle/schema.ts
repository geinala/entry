import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: serial().primaryKey(),
  roleId: varchar("role_id").notNull(),
  clerkUserId: varchar("clerk_user_id").notNull(),
  email: varchar("email").notNull().unique(),
  fullName: varchar("full_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const roleTable = pgTable("roles", {
  id: serial().primaryKey(),
  name: varchar("name").notNull().unique(),
  description: varchar("description").notNull(),
});

export const permissionTable = pgTable("permissions", {
  id: serial().primaryKey(),
  name: varchar("name").notNull().unique(),
  description: varchar("description").notNull(),
});

export const rolePermissionTable = pgTable("role_permissions", {
  id: serial().primaryKey(),
  roleId: varchar("role_id").notNull(),
  permissionId: varchar("permission_id").notNull(),
});
