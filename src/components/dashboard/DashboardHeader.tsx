"use client"

import { useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet"

import { Menu, LayoutDashboard, Receipt, Wallet, Settings, LogOut } from "lucide-react"

interface DashboardHeaderProps {
  userProfile: any
  workspaces: { id: string, name: string }[]
  currentWorkspaceId: string
}

export function DashboardHeader({ userProfile, workspaces, currentWorkspaceId }: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname() 
  const searchParams = useSearchParams()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const urlWorkspaceId = searchParams.get("workspaceId")
  const activeValue = urlWorkspaceId || currentWorkspaceId

  const handleWorkspaceChange = (value: string) => {
    // Keeps month selected, only changes workspace
    const params = new URLSearchParams(searchParams.toString())
    params.set("workspaceId", value)
    
    // Keeps current page
    router.push(`${pathname}?${params.toString()}`)
  }

  const initials = userProfile?.full_name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || 'U'

  const menuItems = [
    { icon: LayoutDashboard, label: "Visão Geral", href: "/" },
    { icon: Receipt, label: "Transações", href: "/transactions" },
    { icon: Wallet, label: "Carteiras", href: "/workspaces" },
    { icon: Settings, label: "Configurações", href: "/settings" },
  ]

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
      
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-zinc-400 hover:text-white">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-zinc-950 border-r border-zinc-800 text-white w-72 p-0">
            <div className="sr-only">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Navegação</SheetDescription>
            </div>
            
            <div className="p-6 h-16 flex items-center border-b border-zinc-800 bg-zinc-900/50">
              <h1 className="text-xl font-bold tracking-tighter text-emerald-500 flex items-center gap-2">
                💰 FinTrack
              </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 mt-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                
                const smartLink = urlWorkspaceId 
                  ? `${item.href}?workspaceId=${urlWorkspaceId}` 
                  : item.href

                return (
                  <Link key={item.href} href={smartLink} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 h-12 transition-all ${
                        isActive 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_-5px_rgba(16,185,129,0.5)]" 
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                      }`}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </nav>
            
            <div className="absolute bottom-0 left-0 w-full p-4 border-t border-zinc-800 bg-zinc-900/30">
               <div className="flex items-center gap-3 px-2">
                  <Avatar className="h-8 w-8 border border-zinc-700">
                    <AvatarImage src={userProfile?.avatar_url} />
                    <AvatarFallback className="bg-emerald-900 text-emerald-200 text-xs">
                        {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">{userProfile?.full_name}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{userProfile?.email}</p>
                  </div>
               </div>
            </div>

          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400 hidden lg:inline">Carteira:</span>
          <Select key={activeValue} value={activeValue} onValueChange={handleWorkspaceChange}>
            <SelectTrigger className="w-40 md:w-[200px] bg-zinc-950 border-zinc-700 text-white h-9 focus:ring-emerald-500/20">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
              {workspaces.map(ws => (
                <SelectItem key={ws.id} value={ws.id}>{ws.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* RIGHT SIDE */}
      <div className="hidden md:flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-white">{userProfile?.full_name}</p>
          <p className="text-[10px] text-zinc-500">Conta Gratuita</p>
        </div>
        <Avatar className="h-9 w-9 border border-zinc-700">
          <AvatarImage src={userProfile?.avatar_url} />
          <AvatarFallback className="bg-emerald-900 text-emerald-200 text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}