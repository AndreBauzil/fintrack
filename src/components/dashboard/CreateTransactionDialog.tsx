"use client"

import { useState } from "react"
import { createTransaction } from "@/app/(dashboard)/actions"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { PlusCircle, Loader2 } from "lucide-react"

export function CreateTransactionDialog({ workspaceId }: { workspaceId: string }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(event.currentTarget)
    
    try {
      await createTransaction(formData)
      setOpen(false) // Fecha o modal
      // Opcional: Resetar form
    } catch (error) {
      alert("Erro ao salvar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <PlusCircle size={16} /> Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Adicione uma receita ou despesa à sua carteira.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <input type="hidden" name="workspaceId" value={workspaceId} />
          
          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" name="description" placeholder="Ex: Mercado Semanal" required className="bg-zinc-900 border-zinc-700" />
          </div>

          {/* Value and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input id="amount" name="amount" type="number" step="0.01" placeholder="0,00" required className="bg-zinc-900 border-zinc-700" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select name="type" defaultValue="expense">
                <SelectTrigger className="bg-zinc-900 border-zinc-700">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="expense">🔴 Despesa</SelectItem>
                  <SelectItem value="income">🟢 Receita</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Select name="category" defaultValue="outros">
                <SelectTrigger className="bg-zinc-900 border-zinc-700">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="moradia">🏠 Moradia</SelectItem>
                  <SelectItem value="alimentacao">🛒 Alimentação</SelectItem>
                  <SelectItem value="transporte">🚗 Transporte</SelectItem>
                  <SelectItem value="lazer">🎉 Lazer</SelectItem>
                  <SelectItem value="salario">💰 Salário</SelectItem>
                  <SelectItem value="outros">📦 Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Data</Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]} 
                required 
                className="bg-zinc-900 border-zinc-700 block" 
              />
            </div>
          </div>

          {/* Recurrence Checkbox */}
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" name="isRecurring" id="isRecurring" className="accent-emerald-500 w-4 h-4" />
            <Label htmlFor="isRecurring" className="text-sm text-zinc-400 font-normal cursor-pointer">
              Esta é uma despesa recorrente (mensal)
            </Label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full mt-2">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar Transação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}