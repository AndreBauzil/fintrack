"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function MonthSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname() 
  
  const currentMonth = searchParams.get('month') || new Date().toISOString().slice(0, 7)
  const date = new Date(currentMonth + "-02")

  // Generic function to change month keeping the route
  const changeMonth = (offset: number) => {
    const newDate = new Date(date.setMonth(date.getMonth() + offset))
    const monthStr = newDate.toISOString().slice(0, 7)
    
    // Clones current parameters 
    const params = new URLSearchParams(searchParams.toString())
    params.set('month', monthStr)

    // Navegates to SAME page where user is
    router.push(`${pathname}?${params.toString()}`)
  }

  const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
      <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)} className="hover:bg-zinc-800 text-zinc-400 hover:text-white">
        <ChevronLeft size={16} />
      </Button>
      <span className="text-sm font-medium text-white capitalize min-w-[120px] text-center">
        {label}
      </span>
      <Button variant="ghost" size="icon" onClick={() => changeMonth(1)} className="hover:bg-zinc-800 text-zinc-400 hover:text-white">
        <ChevronRight size={16} />
      </Button>
    </div>
  )
}