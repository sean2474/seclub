import { redirect } from "next/navigation"
import { LockKeyhole } from "lucide-react"
import type { ReactNode } from "react"
import { getProfile, getUser } from "@/lib/action/auth"
import { SecuredShell } from "./_components/secured-shell"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getUser()
  if (!user) redirect("/login")

  const profile = await getProfile(user.id)
  if (!profile) redirect("/login")

  if (profile.role !== "admin") {
    return (
      <h1 className="flex items-center justify-center h-screen text-2xl">
        <LockKeyhole className="mr-2 h-8 w-8" strokeWidth={1.5} /> 접근 권한이 없습니다.
      </h1>
    )
  }

  return (
    <SecuredShell user={user} profile={profile}>
      {children}
    </SecuredShell>
  )
}
