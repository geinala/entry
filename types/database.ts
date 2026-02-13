import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  userTable,
  roleTable,
  permissionTable,
  waitlistTable,
  waitlistStatusEnum,
} from "@/drizzle/schema";

// User Types
export type TUser = InferSelectModel<typeof userTable>;

// Role Types
type TRole = InferSelectModel<typeof roleTable>;

// Permission Types
type TPermission = InferSelectModel<typeof permissionTable>;

export type TRoleWithPermissions = TRole & {
  permissions?: TPermission[];
};

export type TUserWithRoleAndPermissions = TUser & {
  role?: TRoleWithPermissions;
};

// Waitlist Types
export type TWaitlistEntry = InferSelectModel<typeof waitlistTable>;
export type TNewWaitlistEntry = InferInsertModel<typeof waitlistTable>;
export type TWaitlistStatus = (typeof waitlistStatusEnum.enumValues)[number];
