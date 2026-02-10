import { db } from "@/lib/db";
import { WaitlistFormType } from "./waitlist.schema";
import { waitlistTable } from "@/drizzle/schema";
import { NewWaitlistEntry } from "@/types/database";
import { WAITLIST_SOURCE } from "@/common/constants/application";

export const createWaitlistEntryRepository = async (data: WaitlistFormType) => {
  const waitlistEntry: NewWaitlistEntry = {
    email: data.email,
    fullName: data.name,
    source: WAITLIST_SOURCE,
  };

  return db.insert(waitlistTable).values(waitlistEntry);
};
