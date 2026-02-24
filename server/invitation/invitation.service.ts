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
import { NotFoundException } from "@/common/exception/not-found.exception";
import { BadRequestException } from "@/common/exception/bad-request.exception";

export const sendInvitationsService = async (waitlistIds: number[]) => {
  await updateWaitlistEntryRepository(waitlistIds, { status: "sending" });

  return await server.post("/invitations", { waitlist_ids: waitlistIds });
};

export const acceptInvitationService = async (token: string) => {
  const entry = await getWaitlistEntryByTokenRepository(token);

  if (!entry) {
    throw new NotFoundException("Invitation is not valid");
  }

  const isInvited = entry.invitedAt && entry.status === "invited";

  if (!isInvited) {
    throw new BadRequestException("Invitation is not valid");
  }

  const isTokenExpired = entry.expiredAt && new Date() > new Date(entry.expiredAt);

  if (isTokenExpired) {
    throw new BadRequestException("Invitation token is expired");
  }

  const isAlreadyConfirmed = entry.status === "confirmed";

  if (isAlreadyConfirmed) {
    throw new BadRequestException("Invitation has already been accepted");
  }

  const role = await getRoleByNameRepository(ROLE_ENUM.COMMON);

  if (!role) {
    throw new NotFoundException("Role not found");
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
};

export const revokeInvitationService = async (waitlistIds: number[]) => {
  return await server.post("/invitations/revoke/bulk", { waitlist_ids: waitlistIds });
};
