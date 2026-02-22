export const PERMISSIONS = {
  FULL_ACCESS: "full-access",

  // Waitlist
  WAITLIST_INVITE: "waitlist:invite",
  WAITLIST_VIEW: "waitlist:view",
  WAITLIST_REVOKE: "waitlist:revoke",
  WAITLIST_DENY: "waitlist:deny",

  DASHBOARD_VIEW: "dashboard:view",
};

export type TPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
