export const ApiEndpoints = {
  login: "auth/login",
  refreshToken: "auth/refreshtoken",
  register: "auth/register",
  verify: "auth/verify",
  resendOtp: "auth/resend-otp",
  programs: "programs",
  currentUser: "users/me",
  users: "users",
  logout: "auth/logout",
  forgotPassword: "auth/forgotpassword",
  resetPassword: "auth/resetpassword",

  subscriptionPlans: "subscription-plans",
  subscriptionPlanById: (id: string) => `subscription-plans/${id}`,
  initializeSubscription: "subscriptions/initialize",
  verifySubscription: "subscriptions/verify",
  mySubscription: "subscriptions/me",
  subscriptions: "subscriptions",

  uploadMaterial: "materials",
  getMaterials: "materials",
  deleteMaterial: (id: string) => `materials/${id}`,
  downloadMaterial: (id: string) => `materials/${id}/download`,

  notifications: "/notifications",
  getNotifications: "/notifications",
  readNotification: (id: string) => `/notifications/${id}/read`,
  deleteNotification: (id: string) => `/notifications/${id}`,

  dashboard: "/dashboard",

  aiExplain: "ai/explain",
  aiSolve: "ai/solve",
  aiSummarize: "ai/summarize",
  aiInteractions: "ai/interactions",
  aiInteractionById: (id: string) => `ai/interactions/${id}`,
  aiInteractionDownload: (id: string) => `ai/interactions/${id}/download`,
} as const;
