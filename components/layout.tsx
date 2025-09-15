'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Sidebar } from './sidebar'
import { usePermissions } from '@/hooks/usePermissions'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const { isAuthenticated, loading } = usePermissions()

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
