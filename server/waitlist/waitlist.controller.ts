import { validateSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
import { WaitlistFormSchema } from "./waitlist.schema";
import { createWaitlistEntryService } from "./waitlist.service";

export const createWaitlistEntryController = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const result = validateSchema(WaitlistFormSchema, body);

    if (!result.success) {
      return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
    }

    await createWaitlistEntryService(result.data);

    return NextResponse.json({ message: "Waitlist entry created successfully" }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
};
