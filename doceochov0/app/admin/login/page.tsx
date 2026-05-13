import AdminLoginForm from '@/components/admin/admin-login-form'

export const metadata = {
  title: 'Inicio de Sesión Admin - DoceOcho Estudio',
  description: 'Panel de administración',
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-petroleum-dark">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-cream mb-2">Inicio de Sesión Admin</h1>
          <p className="text-cream/60 text-sm">DoceOcho Estudio</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}
