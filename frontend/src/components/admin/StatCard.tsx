import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  color?: string
}

export default function StatCard({ label, value, icon, color = 'text-primary' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4">
      <div className={`text-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  )
}
