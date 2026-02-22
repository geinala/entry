import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { userTable, waitlistTable, waitlistStatusEnum, roleTable } from "@/drizzle/schema";

// User Types
export type TUser = InferSelectModel<typeof userTable>;

// Role Types
export type TRole = InferSelectModel<typeof roleTable>;

// User with Role and Permissions
export type TUserWithRoleAndPermissionNames = TUser & {
  role: string;
  permissions: string[];
};

// Waitlist Types
export type TWaitlistEntry = InferSelectModel<typeof waitlistTable>;
export type TNewWaitlistEntry = InferInsertModel<typeof waitlistTable>;
export type TWaitlistStatus = (typeof waitlistStatusEnum.enumValues)[number];
