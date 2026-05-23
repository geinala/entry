import { handleException } from "@/common/exception/helper";
import { responseFormatter } from "@/lib/response-formatter";
import { revalidateAddressRowService } from "./revalidate.service";

export const revalidateAddressRowController = async (jobId: string) => {
  try {
    await revalidateAddressRowService(jobId);

    return responseFormatter.success({
      message: "Address row revalidated successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
