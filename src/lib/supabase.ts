import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type BirdStrike = {
  id?: number
  date: string
  time?: string | null
  location?: string | null
  building: string
  bird_condition: 'deceased' | 'injured' | 'stunned' | 'unknown'
  species?: string | null
  reporter_email?: string | null
  notes?: string | null
  created_at?: string
}