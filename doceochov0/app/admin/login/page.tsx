import AdminLoginForm from '@/components/admin/admin-login-form'

export const metadata = {
  title: 'Admin Login - DoceOcho Studio',
  description: 'Admin panel login',
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-petroleum-dark">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-cream mb-2">Admin Login</h1>
          <p className="text-cream/60 text-sm">DoceOcho Studio</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}
