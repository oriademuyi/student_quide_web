export interface DashboardData {
  role: string;
  materialsCount: number;
  pastQuestionsCount: number;
  unreadNotificationsCount: number;
  totalMaterials: number;
  totalPastQuestions: number;
  totalStudents: number;
  totalAdmins: number;
  totalResults: number;
  totalNotifications: number;
}

export interface DashboardResponse {
  status: string;
  message: string;
  data: DashboardData;
}
