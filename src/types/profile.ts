export interface Faculty {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
  faculty?: Faculty | null;
}

export interface Program {
  id: string;
  name: string;
  type: string;
  department?: Department | null;
}

export interface SubscriptionRecord {
  id: string;
  planName: string;
  amount: number;
  provider: string;
  reference: string;
  status: string;
  startDate: string | null;
  expiryDate: string | null;
  isActive: boolean;
  createdAt: string | null;
}

export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  matricNumber: string | null;
  role: string;
  phone: string | null;
  program: Program | null;
  level: string;
  isVerified: boolean;
  subscription: SubscriptionRecord | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ProfileResponse {
  status: string;
  message: string;
  data: ProfileUser;
}
