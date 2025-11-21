export type UserPlanInfoResponse = {
  current_plan: "pro-single" | "free"; // e.g. "pro-single"
  documents_total: number;
  documents_used: number;
  guest_user: boolean;
  role: "admin" | "user";
  tenant_exists: boolean;
  tenant_id: string;
  usage: {
    addon_used: number;
    base_used: number;
    remaining: number;
  };
  user_created: boolean;
  user_id: string;
  companyImageSignature: string;
  userImageSignature: string;
  defaultLocation: string;
  defaultReason: string;
};

export type OnboardingStatusResponse = {
  tenantExists: boolean;
  userExists: boolean;
};
