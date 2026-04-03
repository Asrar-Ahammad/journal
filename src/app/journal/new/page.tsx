import { auth } from "@/auth"
import EditorClient from "../EditorClient"

export default async function NewJournalPage() {
  const session = await auth()
  
  if (!session?.user) {
    return null
  }

  return <EditorClient />
}
