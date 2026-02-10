import {
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable(
  "users",
  {
    id: serial().primaryKey(),
    roleId: integer("role_id").notNull(),
    clerkUserId: varchar("clerk_user_id").notNull(),
    email: varchar("email").notNull().unique(),
    fullName: varchar("full_name").notNull(),
    imageUrl: varchar("image_url"),
    hasImage: integer("has_image").notNull().default(0),
    lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [roleTable.id],
      name: "users_role_id_roles_id_fk",
    }),
    index("users_clerk_user_id_idx").on(table.clerkUserId),
    index("users_role_id_idx").on(table.roleId),
  ],
);

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

export const rolePermissionTable = pgTable(
  "role_permissions",
  {
    id: serial().primaryKey(),
    roleId: integer("role_id").references(() => roleTable.id),
    permissionId: integer("permission_id").references(() => permissionTable.id),
  },
  (table) => [
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [roleTable.id],
      name: "role_permissions_role_id_roles_id_fk",
    }),
    foreignKey({
      columns: [table.permissionId],
      foreignColumns: [permissionTable.id],
      name: "role_permissions_permission_id_permissions_id_fk",
    }),
    index("role_permissions_role_id_idx").on(table.roleId),
    index("role_permissions_permission_id_idx").on(table.permissionId),
  ],
);

export const waitlistStatusEnum = pgEnum("waitlist_status_enum", [
  "pending",
  "approved",
  "rejected",
  "invited",
]);

export const waitlistTable = pgTable("waitlists", {
  id: serial().primaryKey(),
  email: varchar("email").notNull().unique(),
  fullName: varchar("full_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  status: waitlistStatusEnum("status").notNull().default("pending"),
  source: varchar("source").notNull().default("organic"),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
