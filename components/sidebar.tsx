'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Users,
  TrendingUp,
  Package,
  UserCheck,
  Truck,
  FileText,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePermissions } from '@/hooks/usePermissions'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, adminOnly: false },
  { name: 'Vendas', href: '/vendas', icon: ShoppingCart, adminOnly: false },
  { name: 'Despesas', href: '/despesas', icon: CreditCard, adminOnly: false },
  { name: 'Fiados', href: '/fiados', icon: Users, adminOnly: false },
  { name: 'Lucros', href: '/lucros', icon: TrendingUp, adminOnly: true },
  { name: 'Estoque', href: '/estoque', icon: Package, adminOnly: false },
  { name: 'Funcionários', href: '/funcionarios', icon: UserCheck, adminOnly: true },
  { name: 'Veículos', href: '/veiculos', icon: Truck, adminOnly: true },
  { name: 'Relatórios', href: '/relatorios', icon: FileText, adminOnly: true },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { isAdmin } = usePermissions()

  const filteredNavigation = navigation.filter(item => {
    if (item.adminOnly && !isAdmin) {
      return false
    }
    return true
  })

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">AutomationGas</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-2 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {session?.user?.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">
              {session?.user?.name || 'Usuário'}
            </p>
            <p className="text-xs text-gray-400">
              {session?.user?.role === 'ADMINISTRATIVO' ? 'Administrativo' : 'Atendente'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  )
}
