'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAdmin() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('admin_token')
    if (!stored) {
      router.push('/admin/login')
    } else {
      setToken(stored)
    }
  }, [router])

  function logout() {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  return { token, logout }
}
