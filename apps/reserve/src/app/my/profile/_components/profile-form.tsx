"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    phone: string;
    birthDate: string;
    address: string;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleSave = async () => {
    setIsSaving(true);
    // 실제로는 API 호출
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg border border-foreground/10 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-foreground">기본 정보</h2>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer text-sm font-medium text-primary hover:underline"
          >
            수정
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setFormData(initialData);
              setIsEditing(false);
            }}
            className="cursor-pointer text-sm text-foreground/60 hover:text-foreground"
          >
            취소
          </button>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
            <User className="size-4" />
            이름
          </label>
          {isEditing ? (
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-10"
            />
          ) : (
            <p className="py-2 text-foreground">{formData.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
            <Mail className="size-4" />
            이메일
          </label>
          {isEditing ? (
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-10"
            />
          ) : (
            <p className="py-2 text-foreground">{formData.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
            <Phone className="size-4" />
            전화번호
          </label>
          {isEditing ? (
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-10"
            />
          ) : (
            <p className="py-2 text-foreground">{formData.phone}</p>
          )}
        </div>

        {/* Birth Date */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
            <Calendar className="size-4" />
            생년월일
          </label>
          {isEditing ? (
            <Input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="h-10"
            />
          ) : (
            <p className="py-2 text-foreground">{formData.birthDate}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
            <MapPin className="size-4" />
            주소
          </label>
          {isEditing ? (
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="h-10"
            />
          ) : (
            <p className="py-2 text-foreground">{formData.address || "-"}</p>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="mt-6">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full cursor-pointer bg-foreground text-background hover:bg-foreground/90"
          >
            {isSaving ? (
              "저장 중..."
            ) : (
              <>
                <Save className="mr-2 size-4" />
                변경사항 저장
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
