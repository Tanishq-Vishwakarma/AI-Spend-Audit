import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Save audit to DB
export async function saveAudit(auditData: any) {
  const { data, error } = await supabase
    .from('audits')
    .insert([auditData])
    .select('id')
    .single()

  if (error) throw new Error(`Failed to save audit: ${error.message}`)
  return data
}

// Fetch audit by ID (for shareable URL)
export async function fetchAudit(id: string) {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

// Save lead (email capture)
export async function saveLead(leadData: any) {
  const { data, error } = await supabase
    .from('leads')
    .insert([leadData])
    .select('id')
    .single()

  if (error) throw new Error(`Failed to save lead: ${error.message}`)
  return data
}