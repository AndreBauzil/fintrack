"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation" 

import { LayoutDashboard, Receipt, Wallet, WalletCards, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems = [
  { icon: LayoutDashboard, label: "Visão Geral", href: "/dashboard" },
  { icon: Receipt, label: "Transações", href: "/transactions" },
  { icon: Wallet, label: "Carteiras", href: "/workspaces" },
  { icon: Settings, label: "Configurações", href: "/settings" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams() // Hook to read current URL
  
  // Gets ID from current wallet
  const currentWorkspaceId = searchParams.get('workspaceId')

  // Auxiliary function to generate link keeping the context
  const getHref = (path: string) => {
    if (!currentWorkspaceId) return path
    return `${path}?workspaceId=${currentWorkspaceId}`
  }

  return (
    <aside className="w-64 h-screen bg-zinc-900 border-r border-zinc-800 hidden lg:flex flex-col sticky top-0">
      
      {/* Logo */}
      <div className="p-6 h-16 flex items-center border-b border-zinc-800">
        <h1 className="text-xl font-bold tracking-tighter text-emerald-500 flex items-center gap-2">
          <WalletCards className="h-6 w-6" />
          FinTrack
        </h1>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          const smartLink = getHref(item.href)

          return (
            <Link key={item.href} draggable="false" href={smartLink}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 h-12 transition-all ${
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}