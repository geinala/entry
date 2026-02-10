import { WaitlistFormType } from "./waitlist.schema";
import { createWaitlistEntryRepository } from "./waitlist.repository";

export const createWaitlistEntryService = async (data: WaitlistFormType) => {
  return await createWaitlistEntryRepository(data);
};
