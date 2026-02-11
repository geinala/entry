import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  userTable,
  roleTable,
  permissionTable,
  rolePermissionTable,
  waitlistTable,
  waitlistStatusEnum,
} from "@/drizzle/schema";

// User Types
export type User = InferSelectModel<typeof userTable>;
export type NewUser = InferInsertModel<typeof userTable>;

// Role Types
export type Role = InferSelectModel<typeof roleTable>;
export type NewRole = InferInsertModel<typeof roleTable>;

// Permission Types
export type Permission = InferSelectModel<typeof permissionTable>;
export type NewPermission = InferInsertModel<typeof permissionTable>;

// Role Permission Types
export type RolePermission = InferSelectModel<typeof rolePermissionTable>;
export type NewRolePermission = InferInsertModel<typeof rolePermissionTable>;

// Extended Types for API Responses
export type UserDetails = User & {
  role?: Role;
};

export type RoleWithPermissions = Role & {
  permissions?: Permission[];
};

export type UserWithRoleAndPermissions = User & {
  role?: RoleWithPermissions;
};

// Waitlist Types
export type WaitlistEntry = InferSelectModel<typeof waitlistTable>;
export type NewWaitlistEntry = InferInsertModel<typeof waitlistTable>;
export type WaitlistStatus = (typeof waitlistStatusEnum.enumValues)[number];
