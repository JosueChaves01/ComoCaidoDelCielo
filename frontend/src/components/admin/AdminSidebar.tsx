'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CalendarDays, Building2, LogOut } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/reservaciones', label: 'Reservaciones', icon: CalendarDays },
  { href: '/admin/terrazas', label: 'Terrazas', icon: Building2 },
]

interface AdminSidebarProps {
  onLogout: () => void
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-60 h-screen bg-primary flex flex-col shrink-0">
      <div className="px-6 py-6 border-b border-white/10">
        <p className="text-white font-serif text-lg font-semibold">Como Caído</p>
        <p className="text-white/50 text-xs mt-0.5">Panel de Administración</p>
      </div>

      <nav className="flex-1 py-4">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'text-white border-l-2 border-accent bg-white/5'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-2 py-2 text-sm text-white/70 hover:text-white rounded transition-colors"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
