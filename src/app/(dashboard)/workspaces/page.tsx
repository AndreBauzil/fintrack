import { createClient } from "@/lib/supabase/server"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { InviteMemberForm } from "@/components/dashboard/InviteMemberForm"
import { WorkspaceMenu } from "@/components/dashboard/WorkspaceMenu"
import { CreateWorkspaceDialog } from "@/components/dashboard/CreateWorkspaceDialog"

import { Users, Wallet } from "lucide-react"

export default async function WorkspacesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Workspaces where user belongs
  const { data: myMemberships } = await supabase
    .from('workspace_members')
    .select('workspace_id, role, workspaces(name, owner_id)') 
    .eq('user_id', user.id)

  if (!myMemberships || myMemberships.length === 0) {
    return <div className="text-white p-6">Nenhuma carteira encontrada.</div>
  }

  // Promise.all to search on paralel
  const workspacesData = await Promise.all(
    myMemberships.map(async (membership) => {
      const { data: members } = await supabase
        .from('workspace_members')
        .select(`
          role,
          profiles (id, full_name, email, avatar_url)
        `)
        .eq('workspace_id', membership.workspace_id)
      
      const wsData = membership.workspaces as any
      const isOwner = wsData?.owner_id === user.id // Verifica se sou o dono real
  
      return {
        id: membership.workspace_id,
        name: wsData?.name || "Carteira Sem Nome",
        myRole: membership.role,
        isOwner: isOwner, // Passa essa flag
        members: members || []
      }
    })
  )

  return (
    <div className="space-y-8 mx-auto pb-10 w-full max-w-full">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Minhas Carteiras</h2>
          <p className="text-sm text-zinc-400 mt-1">Você participa de {workspacesData.length} carteira(s).</p>
        </div>
        
        <div className="flex w-full sm:w-auto justify-center sm:justify-end">
          {workspacesData.length < 2 && <CreateWorkspaceDialog />}
        </div>
      </div>

      {/* Card for EACH wallet */}
      {workspacesData.map((workspace) => (
        <Card key={workspace.id} className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-white flex items-center justify-between gap-2 text-xl">
                  <div className="flex items-center gap-2">
                    <Wallet className="text-emerald-500" />
                    {workspace.name}
                  </div>
                  
                  {/* Action Menu */}
                  <WorkspaceMenu 
                    workspaceId={workspace.id} 
                    currentName={workspace.name} 
                    isOwner={workspace.isOwner}
                  />
                </CardTitle>
                <CardDescription className="text-zinc-400 mt-1">
                  Seu nível de acesso: <span className="text-emerald-400 font-medium capitalize">{workspace.myRole === 'admin' ? 'Administrador' : 'Membro'}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
              <h3 className="text-sm font-medium text-white mb-3">Convidar para "{workspace.name}"</h3>
              <InviteMemberForm />
            </div>

            {/* Members list */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Users size={14} /> Membros da Equipe
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {workspace.members.map((member: any) => (
                  <div key={member.profiles.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/30 border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.profiles.avatar_url} />
                        <AvatarFallback className="bg-emerald-900/50 text-emerald-200 text-xs">
                          {member.profiles.full_name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{member.profiles.full_name}</p>
                        <p className="text-xs text-zinc-500 truncate max-w-[150px]">{member.profiles.email}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      member.role === 'admin' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {member.role === 'admin' ? 'Admin' : 'Membro'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}