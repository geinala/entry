"use server";

import { NextResponse } from "next/server";

export const onBoardingUserController = async (): Promise<NextResponse> => {
  try {
    return NextResponse.json({ message: "User onboarded successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Error Nich" }, { status: 400 });
  }
};
