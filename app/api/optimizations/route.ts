"use server";

import { JOB_NAMES } from "@/common/constants/queue";
import { queue } from "@/lib/queue";
import { NextRequest, NextResponse } from "next/server";

// TODO: nanti dirapikan
export const POST = async () => {
  const job = await queue.add(
    JOB_NAMES.SOLVE_DVRP,
    {
      time: 1000,
    },
    { attempts: 3, removeOnComplete: true, removeOnFail: false },
  );

  return Response.json({ jobId: job.id, status: "queued" });
};

// TODO: nanti dirapikan
export const GET = async (req: NextRequest) => {
  const jobId = req.nextUrl.searchParams.get("jobId");

  const job = await queue.getJob(jobId!);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const state = await job.getState();

  return NextResponse.json({ jobId, status: "processing" });
};
