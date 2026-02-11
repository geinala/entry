import { waitlistTable } from "@/drizzle/schema";

export type WaitlistSortableKey = keyof Pick<typeof waitlistTable, "fullName" | "email">;

export type WaitlistFilteredColumns = WaitlistSortableKey;
