'use client'

import { Layout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  CreditCard, 
  TrendingUp, 
  Package,
  Users,
  DollarSign
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePermissions } from '@/hooks/usePermissions'

interface DashboardStats {
  totalSales: number
  totalExpenses: number
  netProfit: number
  totalStock: number
  pendingCredits: number
  totalCustomers: number
}

export default function Dashboard() {
  const { isAdmin, isAtendente } = usePermissions()
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalStock: 0,
    pendingCredits: 0,
    totalCustomers: 0
  })
  const [recentSales, setRecentSales] = useState<any[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([])
  const [overdueCredits, setOverdueCredits] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Buscar dados em paralelo
      const [salesResponse, expensesResponse, productsResponse, customersResponse] = await Promise.all([
        fetch('/api/sales'),
        fetch('/api/expenses'),
        fetch('/api/products'),
        fetch('/api/customers')
      ])

      if (salesResponse.ok && expensesResponse.ok && productsResponse.ok && customersResponse.ok) {
        const [salesData, expensesData, productsData, customersData] = await Promise.all([
          salesResponse.json(),
          expensesResponse.json(),
          productsResponse.json(),
          customersResponse.json()
        ])

        // Calcular estatísticas
        const totalSales = salesData
          .filter((sale: any) => sale.status === 'COMPLETED')
          .reduce((sum: number, sale: any) => sum + Number(sale.totalPrice), 0)

        const totalExpenses = expensesData
          .reduce((sum: number, expense: any) => sum + Number(expense.amount), 0)

        const totalStock = productsData
          .reduce((sum: number, product: any) => sum + Number(product.stock), 0)

        const pendingCredits = customersData
          .filter((customer: any) => Number(customer.totalDebt) > 0).length

        // Buscar vendas recentes (últimas 5)
        const recentSalesData = salesData
          .filter((sale: any) => sale.status === 'COMPLETED')
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)

        // Buscar produtos com estoque baixo (menos de 10 unidades)
        const lowStockData = productsData
          .filter((product: any) => Number(product.stock) < 10 && Number(product.stock) > 0)

        // Buscar clientes com fiado vencido (mais de 30 dias)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        const overdueCreditsData = customersData
          .filter((customer: any) => {
            if (Number(customer.totalDebt) <= 0) return false
            const lastPayment = customer.lastPayment
            if (!lastPayment) return true
            return new Date(lastPayment) < thirtyDaysAgo
          })
          .slice(0, 3)

        setStats({
          totalSales,
          totalExpenses,
          netProfit: totalSales - totalExpenses,
          totalStock,
          pendingCredits,
          totalCustomers: customersData.length
        })

        setRecentSales(recentSalesData)
        setLowStockProducts(lowStockData)
        setOverdueCredits(overdueCreditsData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const cards = [
    {
      title: 'Vendas do Mês',
      value: formatCurrency(stats.totalSales),
      description: '+12% em relação ao mês anterior',
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Despesas do Mês',
      value: formatCurrency(stats.totalExpenses),
      description: '+5% em relação ao mês anterior',
      icon: CreditCard,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Lucro Líquido',
      value: formatCurrency(stats.netProfit),
      description: 'Margem de 43.2%',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Estoque Total',
      value: stats.totalStock.toString(),
      description: 'Produtos em estoque',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Fiados Pendentes',
      value: stats.pendingCredits.toString(),
      description: 'Clientes com pagamento pendente',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Total de Clientes',
      value: stats.totalCustomers.toString(),
      description: 'Clientes cadastrados',
      icon: DollarSign,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ]

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard {isAdmin ? '- Administrativo' : '- Atendente'}
          </h1>
          <p className="text-gray-600">
            {isAdmin 
              ? 'Visão geral completa do sistema de gestão' 
              : 'Painel de controle para operações diárias'
            }
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${card.bgColor}`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendas Recentes</CardTitle>
              <CardDescription>Últimas vendas registradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.length > 0 ? recentSales.map((sale) => {
                  const saleDate = new Date(sale.createdAt)
                  const now = new Date()
                  const diffInHours = Math.floor((now.getTime() - saleDate.getTime()) / (1000 * 60 * 60))
                  
                  let dateString = ''
                  if (diffInHours < 1) {
                    dateString = 'Agora há pouco'
                  } else if (diffInHours < 24) {
                    dateString = `Hoje, ${saleDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
                  } else {
                    dateString = saleDate.toLocaleDateString('pt-BR', { 
                      day: '2-digit', 
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  }

                  return (
                    <div key={sale.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{sale.customer?.name || 'Consumidor Final'}</p>
                        <p className="text-sm text-gray-500">{sale.product?.name} - {sale.quantity}x</p>
                        <p className="text-xs text-gray-400">{dateString}</p>
                      </div>
                      <Badge variant="outline">
                        {formatCurrency(Number(sale.totalPrice))}
                      </Badge>
                    </div>
                  )
                }) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>Nenhuma venda recente encontrada</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alertas do Sistema</CardTitle>
              <CardDescription>Notificações importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockProducts.length > 0 && (
                  <div className="flex items-center p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                    <div className="flex-1">
                      <p className="font-medium text-yellow-800">Estoque Baixo</p>
                      <p className="text-sm text-yellow-600">
                        {lowStockProducts.map(product => `${product.name} - ${product.stock} unidades`).join(', ')}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                      Atenção
                    </Badge>
                  </div>
                )}
                
                {overdueCredits.length > 0 && (
                  <div className="flex items-center p-3 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex-1">
                      <p className="font-medium text-red-800">Fiado Vencido</p>
                      <p className="text-sm text-red-600">
                        {overdueCredits.map(customer => `${customer.name} - ${formatCurrency(Number(customer.totalDebt))}`).join(', ')}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-red-600 border-red-300">
                      Urgente
                    </Badge>
                  </div>
                )}

                {stats.netProfit > 0 && (
                  <div className="flex items-center p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex-1">
                      <p className="font-medium text-blue-800">Lucro Positivo</p>
                      <p className="text-sm text-blue-600">
                        Lucro líquido de {formatCurrency(stats.netProfit)} este mês
                      </p>
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-300">
                      Sucesso
                    </Badge>
                  </div>
                )}

                {lowStockProducts.length === 0 && overdueCredits.length === 0 && stats.netProfit <= 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p>Nenhum alerta no momento</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
