"use client"

import { useState } from "react"
import { leaveWorkspace, deleteWorkspace, updateWorkspaceName } from "@/app/(dashboard)/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreVertical, Pencil, LogOut, Trash2, Loader2 } from "lucide-react"

interface WorkspaceMenuProps {
  workspaceId: string
  currentName: string
  isOwner: boolean
}

export function WorkspaceMenu({ workspaceId, currentName, isOwner }: WorkspaceMenuProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Rename Action
  async function handleRename(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    formData.append('workspaceId', workspaceId)
    try {
      await updateWorkspaceName(formData)
      setIsEditOpen(false)
    } catch (e) {
      alert("Erro ao renomear")
    } finally {
      setIsLoading(false)
    }
  }

  // Leave or Delete Action
  async function handleLeaveOrDelete() {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('workspaceId', workspaceId)
    
    try {
      if (isOwner) {
        await deleteWorkspace(formData)
      } else {
        await leaveWorkspace(formData)
      }
      setIsDeleteAlertOpen(false)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
            <MoreVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 text-white">
          {/* Edit Option (only Owners/Admins) */}
          <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="cursor-pointer gap-2">
            <Pencil size={14} /> Renomear
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-zinc-800" />
          
          {/* Option to leave or delete */}
          <DropdownMenuItem 
            onClick={() => setIsDeleteAlertOpen(true)} 
            className={`cursor-pointer gap-2 ${isOwner ? 'text-red-500 hover:text-red-400 hover:bg-red-950/20' : 'text-orange-400 hover:text-orange-300'}`}
          >
            {isOwner ? <><Trash2 size={14} /> Excluir Carteira</> : <><LogOut size={14} /> Sair da Carteira</>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* EDIT DIALOG (RENAME) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Renomear Carteira</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRename} className="grid gap-4 py-4">
            <Input id="name" name="name" defaultValue={currentName} className="bg-zinc-900 border-zinc-700" required />
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isLoading ? <Loader2 className="animate-spin" /> : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONFIRMATION ALERT (LEAVE OR DELETE) */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className={isOwner ? "text-red-500" : "text-white"}>
              {isOwner ? "Excluir Carteira Permanentemente?" : "Sair desta Carteira?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              {isOwner 
                ? "Esta ação não pode ser desfeita. Isso excluirá permanentemente a carteira e TODAS as transações associadas a ela."
                : "Você perderá acesso às transações desta carteira até que seja convidado novamente."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 hover:text-white">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleLeaveOrDelete(); }}
              disabled={isLoading}
              className={isOwner ? "bg-red-600 hover:bg-red-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
            >
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : (isOwner ? "Sim, Excluir" : "Sim, Sair")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}