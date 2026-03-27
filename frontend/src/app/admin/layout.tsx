'use client'

import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAdmin } from '@/hooks/useAdmin'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
