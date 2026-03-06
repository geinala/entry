import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  userTable,
  waitlistTable,
  waitlistStatusEnum,
  roleTable,
  simulationTable,
  simulationUploadedFileTable,
  simulationStatusEnum,
  nodeTable,
} from "@/drizzle/schema";

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

// Simulation Types
export type TSimulation = InferSelectModel<typeof simulationTable>;
export type TSimulationWithDepot = TSimulation & {
  depot: TNode | null;
};
export type TUpdateSimulation = Partial<Omit<TSimulation, "id" | "createdAt" | "updatedAt">>;
export type TSimulationWithUploadedFile = TSimulation & {
  uploadedFile: TSimulationUploadedFile | null;
};

// Simulation Uploaded File Types
export type TSimulationUploadedFile = InferSelectModel<typeof simulationUploadedFileTable>;
export type TNewSimulationUploadedFile = InferInsertModel<typeof simulationUploadedFileTable>;
export type TSimulationStatus = (typeof simulationStatusEnum.enumValues)[number];

// Node Types
export type TNode = InferSelectModel<typeof nodeTable>;
