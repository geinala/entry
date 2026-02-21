import "server-only";

import { server } from "@/lib/axios";
import {
  getWaitlistEntryByTokenRepository,
  updateWaitlistEntryRepository,
} from "../waitlist/waitlist.repository";
import { createUserRepository } from "../user/user.repository";
import { responseFormatter } from "@/lib/response-formatter";
import { ROLE_ENUM } from "@/common/enum/role";
import { getRoleByNameRepository } from "../role/role.repository";
import { clerkService } from "../clerk/clerk.service";

export const sendInvitationsService = async (waitlistIds: number[]) => {
  try {
    await updateWaitlistEntryRepository(waitlistIds, { status: "sending" });

    return await server.post("/invitations", { waitlist_ids: waitlistIds });
  } catch (error) {
    throw error;
  }
};

export const acceptInvitationService = async (token: string) => {
  try {
    const entry = await getWaitlistEntryByTokenRepository(token);

    if (!entry) {
      return responseFormatter.notFound("Invitation is not valid");
    }

    const isInvited = entry.invitedAt && entry.status === "invited";

    if (!isInvited) {
      return responseFormatter.error({
        message: "Invitation is not valid",
        status: 400,
      });
    }

    const isTokenExpired = entry.expiredAt && new Date() > new Date(entry.expiredAt);

    if (isTokenExpired) {
      return responseFormatter.error({
        message: "Invitation token is expired",
        status: 400,
      });
    }

    const isAlreadyConfirmed = entry.status === "confirmed";

    if (isAlreadyConfirmed) {
      return responseFormatter.error({
        message: "Invitation has already been accepted",
        status: 400,
      });
    }

    const role = await getRoleByNameRepository(ROLE_ENUM.COMMON);

    if (!role) {
      return responseFormatter.error({
        message: "Failed to assign role",
      });
    }

    const clerkUser = await clerkService.createClerkUser({
      email: entry.email,
      lastName: entry.lastName,
      firstName: entry.firstName,
    });

    await createUserRepository(
      clerkUser.id,
      entry.email,
      `${entry.firstName} ${entry.lastName}`,
      role[0].id,
    );

    await updateWaitlistEntryRepository(entry.id, { status: "confirmed" });

    return responseFormatter.success({
      message: "Invitation accepted successfully",
    });
  } catch (error) {
    throw error;
  }
};

export const revokeInvitationService = async (waitlistIds: number[]) => {
  try {
    return await server.post("/invitations/revoke/bulk", { waitlist_ids: waitlistIds });
  } catch (error) {
    throw error;
  }
};
