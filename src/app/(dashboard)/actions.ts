'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Receive ID from wallet, coming from form
  const workspaceId = formData.get('workspaceId') as string

  if (!workspaceId) throw new Error("ID da carteira não fornecido")

  // SECURITY VERIFICATION
  // Confirms if user belong to that wallet
  const { data: membership } = await supabase
    .from('workspace_members')
    .select('id')
    .eq('user_id', user.id)
    .eq('workspace_id', workspaceId) // <--- Filters by wallet
    .single() 

  if (!membership) throw new Error("Você não tem permissão nesta carteira")

  const description = formData.get('description') as string
  const amount = parseFloat(formData.get('amount') as string)
  const type = formData.get('type') as string
  const category = formData.get('category') as string
  const date = formData.get('date') as string

  const { error } = await supabase.from('transactions').insert({
    workspace_id: workspaceId,
    description,
    amount,
    type,
    category,
    date: date || new Date().toISOString(),
  })

  if (error) {
    console.error(error)
    throw new Error("Erro ao criar transação")
  }

  revalidatePath('/')
  revalidatePath('/transactions')
}

export async function inviteMember(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
  
    // Search current Workspace 
    const { data: membership, error: membershipError } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .single()
  
    if (membershipError || !membership) {
      console.error("ERRO AO BUSCAR WORKSPACE DO USUÁRIO LOGADO:", membershipError)
      throw new Error("Sem carteira")
    }
  
    // Search invited user
    const emailToInvite = formData.get('email') as string
    console.log("Tentando convidar:", emailToInvite)
  
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', emailToInvite)
      .single()
  
    if (profileError || !profile) {
      console.error("ERRO AO BUSCAR PERFIL DO CONVIDADO:", profileError)
      throw new Error("Usuário não encontrado. Peça para ele criar uma conta no FinTrack.")
    }
  
    console.log("ID do convidado encontrado:", profile.id)
  
    // Verifies if user's already member
    const { data: existingMember } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', membership.workspace_id)
      .eq('user_id', profile.id)
      .single()
  
    if (existingMember) {
      throw new Error("Usuário já é membro.")
    }
  
    // Add member
    const { error: insertError } = await supabase.from('workspace_members').insert({
      workspace_id: membership.workspace_id,
      user_id: profile.id,
      role: 'member'
    })
  
    if (insertError) {
      console.error("ERRO FATAL AO INSERIR MEMBRO:", insertError)
      throw new Error(`Erro de banco: ${insertError.message} (Code: ${insertError.code})`)
    }
  
    revalidatePath('/workspaces')
}

export async function updateWorkspaceName(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const workspaceId = formData.get('workspaceId') as string
    const newName = formData.get('name') as string

    const { error } = await supabase
        .from('workspaces')
        .update({ name: newName })
        .eq('id', workspaceId)

    if (error) {
        throw new Error("Erro ao renomear carteira")
    }

    revalidatePath('/workspaces')
    revalidatePath('/') 
}

export async function createWorkspace(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
  
    // Verifies limit 
    const { count, error: countError } = await supabase
      .from('workspace_members')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
  
    if (countError) {
      throw new Error("Erro ao verificar limite")
    }
  
    if (count && count >= 2) { 
      throw new Error("Limite de carteiras atingido (Máx: 2).")
    }
  
    const name = formData.get('name') as string
  
    // RPC - Replace manual inserts. Calls SQL function created.
    const { data: newWorkspaceId, error } = await supabase
      .rpc('create_new_workspace', {
        workspace_name: name
      })
  
    if (error) {
      console.error("Erro RPC:", error)
      throw new Error(`Erro ao criar carteira: ${error.message}`)
    }
  
    revalidatePath('/workspaces')
    revalidatePath('/')
}

export async function deleteTransaction(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
  
    const transactionId = formData.get('id') as string

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId)
  
    if (error) {
      console.error("Erro ao deletar:", error)
      throw new Error("Erro ao excluir transação")
    }
  
    revalidatePath('/')
    revalidatePath('/transactions')
}

export async function updateTransaction(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
  
    const id = formData.get('id') as string
    const description = formData.get('description') as string
    const amount = parseFloat(formData.get('amount') as string)
    const type = formData.get('type') as string
    const category = formData.get('category') as string
    const date = formData.get('date') as string
  
    const { error } = await supabase
      .from('transactions')
      .update({
        description,
        amount,
        type,
        category,
        date,
      })
      .eq('id', id)
  
    if (error) {
      console.error("Erro ao atualizar:", error)
      throw new Error("Erro ao atualizar transação")
    }
  
    revalidatePath('/')
    revalidatePath('/transactions')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const fullName = formData.get('fullName') as string

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id)

  if (error) {
    throw new Error("Erro ao atualizar perfil")
  }

  revalidatePath('/settings')
  revalidatePath('/') 
}