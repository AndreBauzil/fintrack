import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { updateProfile } from "@/app/(dashboard)/actions"

import { Save } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const initials = profile?.full_name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || 'U'

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Configurações</h2>
        <p className="text-zinc-400">Gerencie suas informações pessoais.</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Meu Perfil</CardTitle>
          <CardDescription className="text-zinc-400">
            Informações visíveis para sua equipe.
          </CardDescription>
        </CardHeader>
        
        {/* Edit Form */}
        <form action={updateProfile}>
          <CardContent className="space-y-6">
            
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-zinc-700">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-emerald-900 text-emerald-200 text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">Foto de Perfil</p>
                <p className="text-xs text-zinc-500">Puxada automaticamente do seu provedor de login (Google/Gravatar).</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-zinc-300">Nome Completo</Label>
                <Input 
                  id="fullName" 
                  name="fullName" 
                  defaultValue={profile?.full_name} 
                  className="bg-zinc-950 border-zinc-700 text-white" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">E-mail</Label>
                <Input 
                  id="email" 
                  value={profile?.email} 
                  disabled 
                  className="bg-zinc-950/50 border-zinc-800 text-zinc-500 cursor-not-allowed" 
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center md:justify-start items-center">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 mt-6">
              <Save size={16} /> Salvar Alterações
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}