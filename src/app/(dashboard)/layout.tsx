import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

import Sidebar from "@/components/dashboard/Sidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader" 

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Search profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Search ALL wallets from user
  const { data: memberships } = await supabase
    .from('workspace_members')
    .select('workspace_id, workspaces(name)')
    .eq('user_id', user.id)

  // Format data for Select
  const workspacesList = memberships?.map((m: any) => ({
    id: m.workspace_id,
    name: m.workspaces?.name || "Sem nome"
  })) || []

  // Define which is the default ID (first) to shown on header
  const defaultWorkspaceId = workspacesList[0]?.id || ""

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          userProfile={profile} 
          workspaces={workspacesList}
          currentWorkspaceId={defaultWorkspaceId}
        />

        <main className="flex-1 p-4 sm:p-6 w-full min-w-0 overflow-x-hidden">
          <div className="max-w-6xl mx-auto w-full min-w-0">
             {children}
          </div>
        </main>
      </div>
    </div>
  )
}