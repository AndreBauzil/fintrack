"use client"

import { useState } from "react"
import { updateTransaction } from "@/app/(dashboard)/actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Pencil, Loader2, Save } from "lucide-react"

interface Transaction {
  id: string
  description: string
  amount: number
  type: string
  category: string
  date: string
}

export function EditTransactionDialog({ transaction }: { transaction: Transaction }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    formData.append('id', transaction.id)

    try {
      await updateTransaction(formData)
      setOpen(false)
    } catch (error) {
      alert("Erro ao salvar alterações")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-950/30 transition-colors">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-emerald-500" />
            Editar Transação
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Faça correções neste lançamento.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-zinc-300">Descrição</Label>
            <Input 
              id="description" 
              name="description" 
              defaultValue={transaction.description} 
              required 
              className="bg-zinc-900 border-zinc-700 text-white focus:border-emerald-500 transition-all" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-zinc-300">Valor (R$)</Label>
              <Input 
                id="amount" 
                name="amount" 
                type="number" 
                step="0.01" 
                defaultValue={transaction.amount} 
                required 
                className="bg-zinc-900 border-zinc-700 text-white focus:border-emerald-500 transition-all" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type" className="text-zinc-300">Tipo</Label>
              <Select name="type" defaultValue={transaction.type}>
                <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="expense">🔴 Despesa</SelectItem>
                  <SelectItem value="income">🟢 Receita</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-zinc-300">Categoria</Label>
              <Select name="category" defaultValue={transaction.category}>
                <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                  <SelectValue />
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
              <Label htmlFor="date" className="text-zinc-300">Data</Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                defaultValue={transaction.date} 
                required 
                className="bg-zinc-900 border-zinc-700 text-white block focus:border-emerald-500 transition-all" 
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full h-10 font-medium">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}