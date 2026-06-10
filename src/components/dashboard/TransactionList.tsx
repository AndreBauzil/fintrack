// src/components/dashboard/TransactionList.tsx

"use client"

import { useState } from "react"
import { deleteTransaction } from "@/app/(dashboard)/actions"
import { formatDateDisplay } from "@/lib/utils"
import { MoneyDisplay } from "@/components/dashboard/MoneyDisplay" 

import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { EditTransactionDialog } from "./EditTransactionDialog"
import { Trash2, Loader2, ArrowUpCircle, ArrowDownCircle, Calendar, Repeat } from "lucide-react"

interface Transaction {
  id: string
  description: string
  amount: number
  type: string
  category: string
  date: string
  is_recurring?: boolean 
}

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta transação?")) return

    setDeletingId(id)
    const formData = new FormData()
    formData.append('id', id)

    try {
      await deleteTransaction(formData)
    } catch (error) {
      alert("Erro ao excluir")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    // Colocamos o overflow-hidden na borda externa
    <div className="rounded-md border border-zinc-800 bg-zinc-900 w-full overflow-hidden">
      <div className="w-full overflow-x-auto">
        <Table className="w-full">
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-zinc-900">
            <TableHead className="text-zinc-400">Descrição</TableHead>
            <TableHead className="text-zinc-400">Categoria</TableHead>
            <TableHead className="text-zinc-400">Data</TableHead>
            <TableHead className="text-right text-zinc-400">Valor</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {transactions.map((t) => (
             <TableRow key={t.id} className="border-zinc-800 hover:bg-zinc-900/50 h-16 transition-colors">
             <TableCell className="font-medium text-white">
               <div className="flex items-center gap-2">
                 <span className={`p-2 rounded-full bg-zinc-950 border border-zinc-800 ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                   {t.type === 'income' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                 </span>
                <div className="flex items-center gap-1">
                  {t.description}
                  {t.is_recurring && (
                    <span title="Transação Recorrente">
                      <Repeat className="w-3 h-3 text-emerald-500" />
                    </span>
                  )}
                </div>
               </div>
             </TableCell>

             <TableCell className="text-zinc-400 capitalize">{t.category}</TableCell>
             
             <TableCell>
               <div className="text-zinc-400 flex items-center gap-2">
                 <Calendar className="w-3 h-3" />
                 {formatDateDisplay(t.date)}
               </div>
             </TableCell>

             <TableCell className="text-right font-medium">
               <MoneyDisplay 
                 value={t.type === 'income' ? Number(t.amount) : -Number(t.amount)} 
                 className={t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}
               />
             </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex items-center justify-end gap-2 h-full">
                  <EditTransactionDialog transaction={t} />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(t.id)}
                    disabled={deletingId === t.id}
                    className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                  >
                    {deletingId === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
       </Table>
      </div>
    </div>
  )
}