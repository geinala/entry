import "server-only";

import { responseFormatter } from "@/lib/response-formatter";
import { validateSchema } from "@/lib/validation";
import { NextRequest } from "next/server";
import { sendInvitationsService } from "./invitation.service";
import { SendInvitationSchema } from "@/schemas/invitation.schema";

export const sendInvitationController = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const result = validateSchema(SendInvitationSchema, body);

    if (!result.success && result.error) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid request data",
      });
    }

    const response = await sendInvitationsService(result.data?.waitlistIds);

    if (!response.data.success) {
      return responseFormatter.error({
        message: response.data.message || "Failed to send invitation",
      });
    }

    return responseFormatter.successWithData({
      data: response.data.data,
      message: "Invitation sent successfully",
    });
  } catch (error) {
    console.error("Error in sendInvitationController:", error);

    return responseFormatter.error({
      message: "Failed to send invitation",
    });
  }
};
