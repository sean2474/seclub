import { redirect } from "next/navigation"
import { LockKeyhole } from "lucide-react"
import type { ReactNode } from "react"
import { getProfile, getUser } from "@/lib/action/auth"
import { adminBaseUrl, loginUrl } from "@/lib/auth-urls"
import { SecuredShell } from "./_components/secured-shell"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Auth is delegated to the shared SSO app. Unauthenticated visitors are sent
  // there with ?next= pointing back to admin; the session cookie is shared
  // across *.seclub.local / .seclub.kr so we read it here after they return.
  const user = await getUser()
  if (!user) redirect(loginUrl(adminBaseUrl()))

  const profile = await getProfile(user.id)
  if (!profile) redirect(loginUrl(adminBaseUrl()))

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
