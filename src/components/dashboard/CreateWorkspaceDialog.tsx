"use client"

import { useState } from "react"
import { createWorkspace } from "@/app/(dashboard)/actions"

import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { Plus, Loader2 } from "lucide-react"

export function CreateWorkspaceDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    try {
      await createWorkspace(formData)
      setOpen(false)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 gap-2">
          <Plus size={16} /> Nova Carteira
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Criar Nova Carteira</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Crie uma carteira separada (ex: "Viagem", "Reserva").
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <Input id="name" name="name" placeholder="Nome da Carteira" required className="bg-zinc-900 border-zinc-700" />
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
              {isLoading ? <Loader2 className="animate-spin" /> : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}