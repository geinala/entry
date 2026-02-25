import {
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uuid,
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
  description: varchar("description"),
});

export const permissionTable = pgTable("permissions", {
  id: serial().primaryKey(),
  name: varchar("name").notNull().unique(),
  description: varchar("description"),
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
  "sending",
  "confirmed",
  "denied",
  "invited",
  "revoked",
  "failed",
  "expired",
]);

export const waitlistTable = pgTable(
  "waitlist",
  {
    id: serial().primaryKey(),
    clerkInvitationId: varchar("clerk_invitation_id").unique(),
    email: varchar("email").notNull().unique(),
    firstName: varchar("first_name").notNull(),
    lastName: varchar("last_name").notNull(),
    status: waitlistStatusEnum("status").notNull().default("pending"),
    ticketId: varchar("ticket_id").unique(),
    invitedAt: timestamp("invited_at", { withTimezone: true }),
    expiredAt: timestamp("expired_at", { withTimezone: true }),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_waitlist_status").on(table.status),
    index("idx_waitlist_email").on(table.email),
    index("idx_waitlist_ticket_id").on(table.ticketId),
  ],
);

export const simulationStatusEnum = pgEnum("simulation_status_enum", [
  "pending",
  "running",
  "completed",
  "failed",
]);

export const simulationTable = pgTable(
  "simulations",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: integer("user_id").references(() => userTable.id),
    title: varchar("title", { length: 300 }).notNull(),
    status: simulationStatusEnum("status").notNull().default("pending"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    uploadId: integer("upload_id").references(() => simulationUploadedFileTable.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userTable.id],
      name: "simulations_user_id_users_id_fk",
    }),
    foreignKey({
      columns: [table.uploadId],
      foreignColumns: [simulationUploadedFileTable.id],
      name: "simulations_upload_id_simulation_uploaded_files_id_fk",
    }),
    index("simulations_user_id_idx").on(table.userId),
    index("simulations_status_idx").on(table.status),
  ],
);

export const simulationUploadStatusEnum = pgEnum("simulation_upload_status_enum", [
  "uploaded",
  "validating",
  "failed",
  "ready",
]);

export const simulationUploadedFileTable = pgTable(
  "simulation_uploaded_files",
  {
    id: serial().primaryKey(),
    userId: integer("user_id")
      .references(() => userTable.id)
      .notNull(),
    fileName: varchar("file_name").notNull(),
    filePath: varchar("file_path").notNull(),
    fileErrorPath: varchar("file_error_path"),
    totalRows: integer("total_rows"),
    invalidRows: integer("invalid_rows"),
    processedRows: integer("processed_rows"),
    progressPercentage: integer("progress_percentage").default(0),
    status: simulationUploadStatusEnum("status").notNull().default("uploaded"),
    validatedAt: timestamp("validated_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userTable.id],
      name: "simulation_uploaded_files_user_id_users_id_fk",
    }),
    index("simulation_uploaded_files_user_id_idx").on(table.userId),
  ],
);
