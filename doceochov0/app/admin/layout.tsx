import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If not on login page and no session, redirect to login
  const isLoginPage = false // This is handled by individual pages

  return <div className="min-h-screen bg-petroleum-dark">{children}</div>
}
