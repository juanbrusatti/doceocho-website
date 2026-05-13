import { redirect } from 'next/navigation'
import { getAdminSession } from '@/actions/admin-auth'
import AdminDashboard from '@/components/admin/admin-dashboard'

export const metadata = {
  title: 'Admin Dashboard - DoceOcho Studio',
  description: 'Admin panel dashboard',
}

export default async function AdminPage() {
  const session = await getAdminSession()

  if (!session) {
    redirect('/admin/login')
  }

  return <AdminDashboard />
}
