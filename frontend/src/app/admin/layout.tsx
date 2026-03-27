'use client'

import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAdmin } from '@/hooks/useAdmin'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { token, logout } = useAdmin()

  if (!token) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar onLogout={logout} />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/admin/login') return <>{children}</>

  return <ProtectedLayout>{children}</ProtectedLayout>
}
