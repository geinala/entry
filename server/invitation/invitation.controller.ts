import "server-only";

import { responseFormatter } from "@/lib/response-formatter";
import { validateSchema } from "@/lib/validation";
import { NextRequest } from "next/server";
import {
  acceptInvitationService,
  revokeInvitationService,
  sendInvitationsService,
} from "./invitation.service";
import { SendAndRevokeInvitationSchema } from "@/schemas/invitation.schema";
import { checkUserPermissionsService } from "../permission/permission.service";
import { PERMISSIONS } from "@/common/constants/permissions/permissions";

export const sendInvitationController = async (clerkUserId: string, request: NextRequest) => {
  try {
    await checkUserPermissionsService(clerkUserId, [PERMISSIONS.INVITE_WAITLIST]);

    const body = await request.json();

    const result = validateSchema(SendAndRevokeInvitationSchema, body);

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
  } catch {
    return responseFormatter.error({
      message: "Failed to send invitation",
    });
  }
};

export const acceptInvitationController = async (token: string) => {
  try {
    return await acceptInvitationService(token);
  } catch {
    return responseFormatter.error({
      message: "Failed to accept invitation",
    });
  }
};

export const revokeInvitationController = async (clerkUserId: string, request: NextRequest) => {
  try {
    await checkUserPermissionsService(clerkUserId, [PERMISSIONS.REVOKE_WAITLIST]);

    const body = await request.json();

    const result = validateSchema(SendAndRevokeInvitationSchema, body);

    if (!result.success && result.error) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid request data",
      });
    }

    const response = await revokeInvitationService(result.data?.waitlistIds);

    if (!response.data.success) {
      return responseFormatter.error({
        message: response.data.message || "Failed to revoke invitation",
      });
    }

    return responseFormatter.successWithData({
      data: response.data.data,
      message: "Invitation revoked successfully",
    });
  } catch {
    return responseFormatter.error({
      message: "Failed to revoke invitation",
    });
  }
};
