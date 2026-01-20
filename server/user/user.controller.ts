"use server";

import { NextRequest, NextResponse } from "next/server";

export const onBoardingUserController = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = await req.json();
    return NextResponse.json({ message: "User onboarded successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error Nich" }, { status: 400 });
  }
};
