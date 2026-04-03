import { auth, signOut } from "@/auth"
import DashboardClient from "./DashboardClient"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    return null // NextAuth callback should handle redirect, but just in case
  }

  return (
    <DashboardClient user={session.user} />
  )
}
