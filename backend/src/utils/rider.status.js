const ALL_STATUS = {
  pending: "pending",
  approved: "approved",
  blocked: "blocked",
  break_temporary: "break-temporary",
  break: "break",
  available: "available",
  phone_is_verified: "phone_is_verified",
  verification_pending: "verification_pending",
  signed_in: "signed_in",
};
const RIDER_BREAK_STATUS = {
  break: "break",
  break_temporary: "break-temporary",
};
const RIDER_STATUSES = { ALL_STATUS, RIDER_BREAK_STATUS };
export default RIDER_STATUSES;
