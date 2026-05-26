import { AuthShell } from "@/components/auth-shell"
import { requireSessionForProfile } from "@/lib/action/auth"
import { safeRedirect } from "@/lib/safe-redirect"
import { ProfileForm } from "./_components/profile-form"

export default async function SignupProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const target = safeRedirect(next, "/")
  const { name } = await requireSessionForProfile()

  return (
    <AuthShell
      title="환영합니다"
      subtitle="회원 정보를 마지막으로 확인해주세요."
    >
      <ProfileForm successUrl={target} initialName={name ?? ""} />
    </AuthShell>
  )
}
