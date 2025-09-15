'use client'

import { useSession } from 'next-auth/react'
import { UserRole } from '@prisma/client'

export function usePermissions() {
  const { data: session, status } = useSession()

  const isAdmin = session?.user?.role === UserRole.ADMINISTRATIVO
  const isAtendente = session?.user?.role === UserRole.ATENDENTE
  const isAuthenticated = !!session

  const canAccessReports = isAdmin
  const canManageEmployees = isAdmin
  const canManageVehicles = isAdmin
  const canViewProfits = isAdmin
  const canManageSales = isAuthenticated
  const canManageExpenses = isAuthenticated
  const canManageCredits = isAuthenticated
  const canManageInventory = isAuthenticated

  return {
    isAdmin,
    isAtendente,
    isAuthenticated,
    canAccessReports,
    canManageEmployees,
    canManageVehicles,
    canViewProfits,
    canManageSales,
    canManageExpenses,
    canManageCredits,
    canManageInventory,
    user: session?.user,
    loading: status === 'loading'
  }
}
