import { auth } from "@/auth"
import EditorClient from "../EditorClient"

export default async function EditJournalPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  
  if (!session?.user) {
    return null
  }

  const { id } = await params

  return <EditorClient initialId={id} />
}
