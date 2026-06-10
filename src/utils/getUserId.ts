import { supabase } from '@/supabaseConfig'

/**
 * Returns the id of the currently authenticated Supabase user, or `undefined`
 * if there is no active session. Reads from the locally persisted session
 * (no network round-trip), so it is safe to call frequently inside store actions.
 */
export default async function getUserId(): Promise<string | undefined> {
  const { data } = await supabase.auth.getSession()
  return data.session?.user.id
}
