import { createClient } from '@/lib/supabase/server'

export async function processRecurringTransactions(workspaceId: string) {
  const supabase = await createClient()
  const today = new Date()
  const currentDay = today.getDate()
  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear()

  const { data: recurrings } = await supabase
    .from('transactions')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('is_recurring', true)

  if (!recurrings) return

  for (const item of recurrings) {
    if (currentDay >= (item.due_day || 1)) {
       const { data: exists } = await supabase
         .from('transactions')
         .select('id')
         .eq('workspace_id', workspaceId)
         .eq('description', item.description)
         .eq('date', `${currentYear}-${currentMonth}-${item.due_day}`)
         .single()

       if (!exists) {
         await supabase.from('transactions').insert({
           workspace_id: workspaceId,
           description: item.description,
           amount: item.amount,
           type: item.type,
           category: item.category,
           date: `${currentYear}-${currentMonth}-${item.due_day}`,
           is_recurring: false 
         })
       }
    }
  }
}