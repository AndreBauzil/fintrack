import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { formatDateDisplay } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateTransactionDialog } from "@/components/dashboard/CreateTransactionDialog"
import { MonthSelector } from "@/components/dashboard/MonthSelector"
import { CashFlowChart } from "@/components/dashboard/CashFlowChart"

import { DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string, workspaceId?: string }> 
}) {
  const supabase = await createClient()
  // Waits parameters
  const { month, workspaceId: urlWorkspaceId } = await searchParams
  
  // Security Verification
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Searchs Workspace safely
  let selectedWorkspaceId = urlWorkspaceId

  if (!selectedWorkspaceId) {
    const { data: firstMembership } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .limit(1)
      .single()
    
    if (firstMembership) {
      selectedWorkspaceId = firstMembership.workspace_id
    }
  }

  if (!selectedWorkspaceId) {
    return <div className="text-white">Nenhuma carteira encontrada.</div>
  }

  // Define Dates
  const currentMonth = month || new Date().toISOString().slice(0, 7)
  const startDate = `${currentMonth}-01`
  const [year, m] = currentMonth.split('-')
  const endDate = new Date(parseInt(year), parseInt(m), 0).toISOString().split('T')[0]

  // Search Transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('workspace_id', selectedWorkspaceId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })

  const txs = transactions || []

  // Calculations
  const income = txs.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0)
  const expense = txs.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0)
  const balance = income - expense
  const totalTransactions = txs.length

  // Graph Data
  const daysInMonth = new Date(parseInt(year), parseInt(m), 0).getDate()
  const chartData = []
  let currentBalance = 0 

  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = d.toString().padStart(2, '0')
    const dateStr = `${currentMonth}-${dayStr}`
    
    const dailyTxs = txs.filter(t => t.date === dateStr)
    const dayIncome = dailyTxs.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0)
    const dayExpense = dailyTxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0)
    
    currentBalance += (dayIncome - dayExpense)

    if (new Date(dateStr) <= new Date()) {
        chartData.push({ day: dayStr, balance: currentBalance })
    }
  }

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const workspaceId = selectedWorkspaceId 

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-white">Visão Geral</h2>
        <div className="flex items-center gap-4">
          <MonthSelector />
          <CreateTransactionDialog workspaceId={workspaceId} />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Saldo Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>

          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-white' : 'text-red-500'}`}>
              {formatMoney(balance)}
            </div>
            <p className="text-xs text-zinc-500">Neste mês</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{formatMoney(income)}</div>
            <p className="text-xs text-zinc-500">Neste mês</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatMoney(expense)}</div>
            <p className="text-xs text-zinc-500">Neste mês</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Atividade</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-white">{totalTransactions}</div>
            <p className="text-xs text-zinc-500">Transações neste mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <div className="col-span-1 lg:col-span-4">
          <CashFlowChart data={chartData} />
        </div>

        <Card className="col-span-1 lg:col-span-3 bg-zinc-900 border-zinc-800 h-[400px] overflow-y-auto">
           <CardHeader>
             <CardTitle className="text-white">
                Transações de {new Date(currentMonth + '-02').toLocaleDateString('pt-BR', { month: 'long' })}
             </CardTitle>
           </CardHeader>

           <CardContent>
             <div className="space-y-6">
                {txs.length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center mt-10">Nenhuma transação neste mês.</p>
                ) : (
                  txs.map((t) => (
                    <div key={t.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`p-2 rounded-full shrink-0 ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                           {t.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        </div>
                        <div className="space-y-1 overflow-hidden">
                          <p className="text-sm font-medium leading-none text-white truncate">{t.description}</p>
                          <p className="text-xs text-zinc-500 capitalize truncate">
                            {t.category} • {formatDateDisplay(t.date)}
                          </p>
                        </div>
                      </div>
                      <div className={`font-medium text-sm whitespace-nowrap ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatMoney(Number(t.amount))}
                      </div>
                    </div>
                  ))
                )}
             </div>
           </CardContent>
        </Card>
      </div>
    </div>
  )
}