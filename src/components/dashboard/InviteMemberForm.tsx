"use client"

import { useState } from "react"
import { inviteMember } from "@/app/(dashboard)/actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { UserPlus, Loader2 } from "lucide-react"

export function InviteMemberForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setMessage(null)
    
    const form = event.currentTarget
    const formData = new FormData(form)
    
    try {
      await inviteMember(formData)
      setMessage({ text: "Membro adicionado com sucesso!", type: 'success' })

      form.reset() 
    } catch (error: any) {
      setMessage({ text: error.message || "Erro ao adicionar", type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input 
        name="email" 
        type="email" 
        placeholder="Digite o e-mail do usuário..." 
        required 
        className="bg-zinc-900 border-zinc-700 text-white flex-1"
      />
      <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus size={16} />}
        Convidar
      </Button>
      
      {message && (
        <div className={`fixed bottom-4 right-4 p-4 rounded shadow-lg text-sm z-50 animate-in slide-in-from-bottom-5 ${message.type === 'success' ? 'bg-emerald-900 text-white border border-emerald-700' : 'bg-red-900 text-white border border-red-700'}`}>
          {message.text}
        </div>
      )}
    </form>
  )
}