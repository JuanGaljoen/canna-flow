import { createBrowserClient } from '@supabase/ssr'

// Use only for realtime subscriptions — all other queries use the server client
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
