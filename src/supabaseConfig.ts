import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist the session in localStorage so the user stays logged in across
    // browser restarts (until they sign out or the token expires).
    persistSession: true,
    autoRefreshToken: true,
    // Pick up the access token from the URL after email-confirmation links.
    detectSessionInUrl: true
  }
})
