import "server-only";

import { responseFormatter } from "@/lib/response-formatter";
import { validateSchema } from "@/lib/validation";
import { NextRequest } from "next/server";
import {
  acceptInvitationService,
  revokeInvitationService,
  sendInvitationsService,
} from "./invitation.service";
import {
  SendAndRevokeInvitationSchema,
  TSendAndRevokeInvitation,
} from "@/schemas/invitation.schema";
import { checkUserPermissionsService } from "../permission/permission.service";
import { PERMISSIONS } from "@/common/constants/permissions/permissions";
import { handleException } from "@/common/exception/helper";

export const sendInvitationController = async (clerkUserId: string, request: NextRequest) => {
  try {
    await checkUserPermissionsService(clerkUserId, [PERMISSIONS.INVITE_WAITLIST]);

    const body = await request.json();

    const { data } = validateSchema<TSendAndRevokeInvitation>(SendAndRevokeInvitationSchema, body);
    const { waitlistIds } = data;

    const response = await sendInvitationsService(waitlistIds);

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
    return handleException(error);
  }
};

export const acceptInvitationController = async (token: string) => {
  try {
    return await acceptInvitationService(token);
  } catch (error) {
    return handleException(error);
  }
};

export const revokeInvitationController = async (clerkUserId: string, request: NextRequest) => {
  try {
    await checkUserPermissionsService(clerkUserId, [PERMISSIONS.REVOKE_WAITLIST]);

    const body = await request.json();

    const { data } = validateSchema<TSendAndRevokeInvitation>(SendAndRevokeInvitationSchema, body);
    const { waitlistIds } = data;

    const response = await revokeInvitationService(waitlistIds);

    if (!response.data.success) {
      return responseFormatter.error({
        message: response.data.message || "Failed to revoke invitation",
      });
    }

    return responseFormatter.successWithData({
      data: response.data.data,
      message: "Invitation revoked successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
