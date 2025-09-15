'use client'

import { Layout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import { useRouter } from 'next/navigation'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface ProfitData {
  period: string
  sales: number
  expenses: number
  profit: number
}

interface MonthlyData {
  month: string
  sales: number
  expenses: number
  profit: number
  margin: number
}

export default function Lucros() {
  const { canViewProfits, loading } = usePermissions()
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedYear, setSelectedYear] = useState('2025')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !canViewProfits) {
      router.push('/')
    }
  }, [canViewProfits, loading, router])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando...</div>
        </div>
      </Layout>
    )
  }

  if (!canViewProfits) {
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

  const [dailyData, setDailyData] = useState<ProfitData[]>([])
  const [weeklyData, setWeeklyData] = useState<ProfitData[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [yearlyData, setYearlyData] = useState<ProfitData[]>([])
  const [summaryData, setSummaryData] = useState<any>(null)

  const fetchProfitsData = async (period: string, year: string) => {
    setIsLoading(true)
    try {
      console.log(`Fetching profits data for period: ${period}, year: ${year}`)
      const response = await fetch(`/api/profits?period=${period}&year=${year}`)
      console.log('Profits response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Profits data received:', data)
        
        switch (period) {
          case 'daily':
            setDailyData(data.data || [])
            break
          case 'weekly':
            setWeeklyData(data.data || [])
            break
          case 'monthly':
            setMonthlyData(data.data || [])
            break
          case 'yearly':
            setYearlyData(data.data || [])
            break
        }
        
        setSummaryData(data.summary || {})
      } else {
        console.error('Error fetching profits data:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching profits data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfitsData(selectedPeriod, selectedYear)
  }, [selectedPeriod, selectedYear])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case 'daily':
        return dailyData
      case 'weekly':
        return weeklyData
      case 'monthly':
        return monthlyData
      case 'yearly':
        return yearlyData
      default:
        return monthlyData
    }
  }

  const getTotalSales = () => {
    return summaryData?.totalSales || 0
  }

  const getTotalExpenses = () => {
    return summaryData?.totalExpenses || 0
  }

  const getTotalProfit = () => {
    return summaryData?.totalProfit || 0
  }

  const getProfitMargin = () => {
    return summaryData?.profitMargin || 0
  }

  const getBestMonth = () => {
    return summaryData?.bestPeriod || null
  }

  const getWorstMonth = () => {
    return summaryData?.worstPeriod || null
  }

  const COLORS = ['#10B981', '#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6']

  const pieData = [
    { name: 'Vendas', value: Math.max(0, getTotalSales()), color: '#10B981' },
    { name: 'Despesas', value: Math.max(0, getTotalExpenses()), color: '#EF4444' },
    { name: 'Lucro', value: Math.max(0, getTotalProfit()), color: '#3B82F6' }
  ].filter(item => item.value > 0)

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lucros</h1>
            <p className="text-gray-600">Análise de lucratividade e performance financeira</p>
          </div>
          <div className="flex space-x-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(getTotalSales())}</div>
              <p className="text-xs text-muted-foreground">
                Período selecionado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(getTotalExpenses())}</div>
              <p className="text-xs text-muted-foreground">
                Período selecionado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getTotalProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(getTotalProfit())}
              </div>
              <p className="text-xs text-muted-foreground">
                {getProfitMargin().toFixed(1)}% de margem
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Melhor Mês</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {getBestMonth() ? formatCurrency(getBestMonth()!.profit) : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {getBestMonth()?.month || 'N/A'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de linha - Evolução do lucro */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Lucro</CardTitle>
            <CardDescription>
              Comparação entre vendas, despesas e lucro ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
            ) : getCurrentData().length === 0 ? (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-medium">Nenhum dado encontrado</p>
                  <p className="text-sm">Não há dados para o período selecionado</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={getCurrentData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), '']}
                    labelFormatter={(label) => `Período: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Vendas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="Despesas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    name="Lucro"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de barras - Comparação mensal */}
          <Card>
            <CardHeader>
              <CardTitle>Comparação Mensal</CardTitle>
              <CardDescription>
                Vendas vs Despesas por mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
              ) : monthlyData.length === 0 ? (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="text-lg font-medium">Nenhum dado mensal</p>
                    <p className="text-sm">Não há dados mensais disponíveis</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), '']}
                    />
                    <Legend />
                    <Bar dataKey="sales" fill="#10B981" name="Vendas" />
                    <Bar dataKey="expenses" fill="#EF4444" name="Despesas" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Gráfico de pizza - Distribuição */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição Financeira</CardTitle>
              <CardDescription>
                Proporção de vendas, despesas e lucro
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
              ) : pieData.length === 0 ? (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="text-lg font-medium">Nenhum dado financeiro</p>
                    <p className="text-sm">Não há dados de vendas ou despesas</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabela de dados mensais */}
        <Card>
          <CardHeader>
            <CardTitle>Relatório Mensal Detalhado</CardTitle>
            <CardDescription>
              Análise detalhada dos resultados mensais
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Mês</th>
                      <th className="text-right p-2">Vendas</th>
                      <th className="text-right p-2">Despesas</th>
                      <th className="text-right p-2">Lucro</th>
                      <th className="text-right p-2">Margem</th>
                      <th className="text-center p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((month, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{month.month}</td>
                        <td className="p-2 text-right text-green-600">{formatCurrency(month.sales)}</td>
                        <td className="p-2 text-right text-red-600">{formatCurrency(month.expenses)}</td>
                        <td className={`p-2 text-right font-medium ${month.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(month.profit)}
                        </td>
                        <td className="p-2 text-right">{month.margin.toFixed(1)}%</td>
                        <td className="p-2 text-center">
                          <Badge 
                            className={month.profit >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          >
                            {month.profit >= 0 ? 'Positivo' : 'Negativo'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Insights e recomendações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Insights</CardTitle>
              <CardDescription>
                Análises automáticas dos dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getTotalProfit() > 0 ? (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Lucro Positivo</h4>
                  <p className="text-sm text-green-700">
                    O período selecionado apresentou lucro de {formatCurrency(getTotalProfit())} 
                    com margem de {getProfitMargin().toFixed(1)}%.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900">Lucro Negativo</h4>
                  <p className="text-sm text-red-700">
                    O período selecionado apresentou prejuízo de {formatCurrency(Math.abs(getTotalProfit()))}.
                    Revise os custos e estratégias de vendas.
                  </p>
                </div>
              )}
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Análise de Margem</h4>
                <p className="text-sm text-blue-700">
                  {getProfitMargin() > 20 ? 'Excelente margem de lucro!' : 
                   getProfitMargin() > 10 ? 'Margem de lucro adequada.' : 
                   'Margem de lucro baixa. Considere otimizar custos.'}
                </p>
              </div>
              
              {getBestMonth() && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900">Melhor Período</h4>
                  <p className="text-sm text-purple-700">
                    {getBestMonth().period} foi o melhor período com lucro de {formatCurrency(getBestMonth().profit)}.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recomendações</CardTitle>
              <CardDescription>
                Sugestões para melhorar a lucratividade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getProfitMargin() < 15 && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900">Otimização de Custos</h4>
                  <p className="text-sm text-red-700">
                    Com margem de {getProfitMargin().toFixed(1)}%, considere reduzir despesas 
                    operacionais e negociar melhores preços com fornecedores.
                  </p>
                </div>
              )}
              
              {getTotalExpenses() > getTotalSales() * 0.7 && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900">Controle de Despesas</h4>
                  <p className="text-sm text-yellow-700">
                    As despesas representam {((getTotalExpenses() / getTotalSales()) * 100).toFixed(1)}% 
                    das vendas. Revise categorias de gastos.
                  </p>
                </div>
              )}
              
              {getTotalProfit() > 0 && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Crescimento</h4>
                  <p className="text-sm text-green-700">
                    Com lucro positivo, considere investir em marketing ou 
                    expandir a operação para aumentar as vendas.
                  </p>
                </div>
              )}
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Análise Contínua</h4>
                <p className="text-sm text-blue-700">
                  Monitore regularmente os dados de vendas e despesas para 
                  identificar tendências e oportunidades de melhoria.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
