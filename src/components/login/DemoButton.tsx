'use client'

import { useFormStatus } from 'react-dom'
import { Button } from "@/components/ui/button"
import { UserCircle2, Loader2 } from "lucide-react"

interface DemoButtonProps {
  action: () => void;
}

export function DemoButton({ action }: DemoButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button 
      formAction={action} 
      formNoValidate
      disabled={pending}
      variant="outline"
      className="w-full border-zinc-700 bg-zinc-800 text-zinc-300 transition-all hover:scale-[1.02] active:scale-[0.98] hover:bg-w-800 hover:text-white h-11"
    >
      {pending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <UserCircle2 className="w-4 h-4 mr-2" />
      )}
      {pending ? 'Entrando...' : 'Entrar como Visitante'}
    </Button>
  )
}