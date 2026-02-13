import { waitlistTable } from "@/drizzle/schema";

export type TWaitlistSortableKey = keyof Pick<typeof waitlistTable, "fullName" | "email">;
