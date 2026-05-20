"use client";

import { useEffect, useState } from "react";
import { User, Bell, Shield, ChevronRight, Loader2 } from "lucide-react";
import { RequireAuth } from "../../_components/require-auth";
import { ProfileForm } from "./profile-form";
import { useAuth } from "@/lib/mock-auth";
import { getProfile, updateProfile, type UserProfile } from "@/lib/api";

export function ProfileContent() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getProfile(user.id)
        .then(setProfile)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const handleNotificationChange = async (key: "emailNotification" | "smsNotification" | "marketingConsent", value: boolean) => {
    if (!user || !profile) return;
    const result = await updateProfile(user.id, { [key]: value });
    if (result.success && result.profile) {
      setProfile(result.profile);
    }
  };

  if (isLoading) {
    return (
      <RequireAuth title="프로필 관리">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-foreground/30" />
        </div>
      </RequireAuth>
    );
  }

  if (!profile) {
    return (
      <RequireAuth title="프로필 관리">
        <div className="rounded-lg border border-foreground/10 bg-white p-8 text-center">
          <p className="text-foreground/60">프로필 정보를 불러올 수 없습니다.</p>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth title="프로필 관리">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">프로필 관리</h1>
          <p className="mt-2 text-foreground/60">
            개인 정보를 확인하고 수정할 수 있습니다.
          </p>
        </div>

        {/* Profile Header */}
        <div className="rounded-lg border border-foreground/10 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-foreground/5">
              <User className="size-8 text-foreground/60" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-foreground">{profile.name}</h2>
              <p className="text-sm text-foreground/60">{profile.email}</p>
              <p className="mt-1 text-xs text-foreground/40">
                가입일: {new Date(profile.createdAt).toLocaleDateString("ko-KR")}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <ProfileForm 
          initialData={{
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            birthDate: profile.birthDate || "",
            address: profile.address || "",
            joinedAt: profile.createdAt,
            marketingConsent: profile.marketingConsent,
            emailNotification: profile.emailNotification,
            smsNotification: profile.smsNotification,
          }} 
        />

        {/* Settings Sections */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">설정</h2>
          
          {/* Notification Settings */}
          <div className="rounded-lg border border-foreground/10 bg-white">
            <div className="flex w-full items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="size-5 text-foreground/60" />
                <div>
                  <p className="font-medium text-foreground">알림 설정</p>
                  <p className="text-sm text-foreground/60">이메일, SMS 알림 설정</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-foreground/10 p-4">
              <div className="space-y-4">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-sm text-foreground/80">이메일 알림</span>
                  <input
                    type="checkbox"
                    checked={profile.emailNotification}
                    onChange={(e) => handleNotificationChange("emailNotification", e.target.checked)}
                    className="size-4 cursor-pointer accent-primary"
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-sm text-foreground/80">SMS 알림</span>
                  <input
                    type="checkbox"
                    checked={profile.smsNotification}
                    onChange={(e) => handleNotificationChange("smsNotification", e.target.checked)}
                    className="size-4 cursor-pointer accent-primary"
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-sm text-foreground/80">마케팅 수신 동의</span>
                  <input
                    type="checkbox"
                    checked={profile.marketingConsent}
                    onChange={(e) => handleNotificationChange("marketingConsent", e.target.checked)}
                    className="size-4 cursor-pointer accent-primary"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-lg border border-foreground/10 bg-white">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <Shield className="size-5 text-foreground/60" />
                <div>
                  <p className="font-medium text-foreground">보안 설정</p>
                  <p className="text-sm text-foreground/60">비밀번호 변경, 2단계 인증</p>
                </div>
              </div>
              <ChevronRight className="size-5 text-foreground/40" />
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="font-medium text-red-800">계정 관리</h3>
          <p className="mt-1 text-sm text-red-700">
            계정 삭제 시 모든 데이터가 영구적으로 삭제됩니다.
          </p>
          <button
            type="button"
            className="mt-4 cursor-pointer rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            회원 탈퇴
          </button>
        </section>
      </div>
    </RequireAuth>
  );
}
