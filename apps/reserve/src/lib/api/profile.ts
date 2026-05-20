import type { UserProfile, UpdateProfileData } from "@/types/profile";

// 목업 프로필 데이터
let mockProfile: UserProfile = {
  id: "user-1",
  email: "sean24740@gmail.com",
  name: "박서준",
  phone: "010-1234-5678",
  birthDate: "1990-05-15",
  gender: "male",
  address: "서울시 강남구 테헤란로 123",
  marketingConsent: true,
  emailNotification: true,
  smsNotification: false,
  createdAt: "2025-12-15T10:00:00.000Z",
  updatedAt: "2026-03-01T14:30:00.000Z",
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 프로필 조회
 */
export async function getProfile(userId: string): Promise<UserProfile> {
  await delay(200);
  return mockProfile;
}

/**
 * 프로필 수정
 */
export async function updateProfile(
  userId: string,
  data: UpdateProfileData
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  await delay(300);
  
  // 유효성 검사
  if (data.phone && !/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(data.phone.replace(/-/g, ""))) {
    return { success: false, error: "올바른 전화번호 형식이 아닙니다." };
  }
  
  // 실제로는 DB 업데이트
  mockProfile = {
    ...mockProfile,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  return { success: true, profile: mockProfile };
}

/**
 * 비밀번호 변경
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  await delay(300);
  
  // 목업에서는 항상 성공
  if (newPassword.length < 8) {
    return { success: false, error: "비밀번호는 8자 이상이어야 합니다." };
  }
  
  return { success: true };
}

/**
 * 회원 탈퇴
 */
export async function deleteAccount(
  userId: string,
  password: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  await delay(500);
  
  // 실제로는 비밀번호 확인 후 계정 삭제/비활성화
  return { success: true };
}

/**
 * 이메일 인증 요청
 */
export async function requestEmailVerification(
  email: string
): Promise<{ success: boolean; error?: string }> {
  await delay(300);
  return { success: true };
}

/**
 * 이메일 변경
 */
export async function changeEmail(
  userId: string,
  newEmail: string,
  verificationCode: string
): Promise<{ success: boolean; error?: string }> {
  await delay(300);
  
  // 실제로는 인증 코드 확인 후 이메일 변경
  if (verificationCode !== "123456") {
    return { success: false, error: "인증 코드가 올바르지 않습니다." };
  }
  
  mockProfile.email = newEmail;
  mockProfile.updatedAt = new Date().toISOString();
  
  return { success: true };
}
