export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  birthDate?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  marketingConsent: boolean;
  emailNotification: boolean;
  smsNotification: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  birthDate?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  marketingConsent?: boolean;
  emailNotification?: boolean;
  smsNotification?: boolean;
}
