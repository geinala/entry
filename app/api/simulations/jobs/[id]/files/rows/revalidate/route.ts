import { handleAuthenticatedRequest } from "@/lib/request";
import { revalidateAddressRowController } from "@/server/simulation/job/files/rows/revalidate/revalidate.controller";
import { NextRequest } from "next/server";

export const POST = async (
  request: NextRequest,
  context: { params: Promise<{ id: string; rowId: string }> },
) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await revalidateAddressRowController(id);
    },
  });
};
