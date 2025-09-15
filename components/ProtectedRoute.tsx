'use client'

import { usePermissions } from '@/hooks/usePermissions'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Layout } from './layout'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission: keyof ReturnType<typeof usePermissions>
  fallbackPath?: string
}

export function ProtectedRoute({ 
  children, 
  requiredPermission, 
  fallbackPath = '/' 
}: ProtectedRouteProps) {
  const { [requiredPermission]: hasPermission, loading } = usePermissions()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !hasPermission) {
      router.push(fallbackPath)
    }
  }, [hasPermission, loading, router, fallbackPath])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando...</div>
        </div>
      </Layout>
    )
  }

  if (!hasPermission) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
            <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
          </div>
        </div>
      </Layout>
    )
  }

  return <>{children}</>
}
