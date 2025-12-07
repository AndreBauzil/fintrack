import { createClient } from "@/lib/supabase/server"

import { MonthSelector } from "@/components/dashboard/MonthSelector"
import { CreateTransactionDialog } from "@/components/dashboard/CreateTransactionDialog"
import { TransactionList } from "@/components/dashboard/TransactionList"

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string, workspaceId?: string }>
}) {
  const supabase = await createClient()
  const { month, workspaceId: urlWorkspaceId } = await searchParams
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Workspace
  let selectedWorkspaceId = urlWorkspaceId
  if (!selectedWorkspaceId) {
    const { data: firstMembership } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .limit(1)
      .single()
    selectedWorkspaceId = firstMembership?.workspace_id
  }

  if (!selectedWorkspaceId) return <div className="text-white p-8">Carteira não encontrada.</div>

  // Dates
  const currentMonth = month || new Date().toISOString().slice(0, 7)
  const startDate = `${currentMonth}-01`
  const [year, m] = currentMonth.split('-')
  const endDate = new Date(parseInt(year), parseInt(m), 0).toISOString().split('T')[0]

  // Transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('workspace_id', selectedWorkspaceId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Transações</h2>
          <p className="text-zinc-400">Gerencie suas entradas e saídas.</p>
        </div>
        <div className="flex items-center gap-4">
          <MonthSelector />
          <CreateTransactionDialog workspaceId={selectedWorkspaceId} />
        </div>
      </div>

      <TransactionList transactions={transactions || []} />
    </div>
  )
}