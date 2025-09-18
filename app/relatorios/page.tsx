'use client'

import { Layout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Download, Users, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import { useRouter } from 'next/navigation'

interface EmployeeReport {
  id: string
  name: string
  email: string
  role: string
  totalSales: number
  totalExpenses: number
  netResult: number
  salesCount: number
  expensesCount: number
  sales: Array<{
    id: string
    product: string
    customer: string
    quantity: number
    totalPrice: number
    paymentType: string
    status: string
    date: string
  }>
  expenses: Array<{
    id: string
    description: string
    amount: number
    category: string
    vehicle: string
    date: string
  }>
}

interface ReportData {
  period: {
    startDate?: string
    endDate?: string
  }
  summary: {
    totalEmployees: number
    totalSales: number
    totalExpenses: number
    totalNetResult: number
  }
  employees: EmployeeReport[]
}

export default function Relatorios() {
  const { canManageEmployees, loading } = usePermissions()
  const router = useRouter()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [employees, setEmployees] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeReport | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    employeeId: 'todos'
  })

  useEffect(() => {
    if (!loading && !canManageEmployees) {
      router.push('/')
    } else if (canManageEmployees) {
      fetchEmployees()
    }
  }, [canManageEmployees, loading, router])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando...</div>
        </div>
      </Layout>
    )
  }

  if (!canManageEmployees) {
    return null
  }

  const fetchReport = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      if (filters.employeeId && filters.employeeId !== 'todos') params.append('employeeId', filters.employeeId)

      const response = await fetch(`/api/reports/employees?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      } else {
        console.error('Error fetching report:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching report:', error)
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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMINISTRATIVO':
        return <Badge className="bg-purple-100 text-purple-800">Administrativo</Badge>
      case 'ATENDENTE':
        return <Badge className="bg-blue-100 text-blue-800">Atendente</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getPaymentTypeBadge = (type: string) => {
    switch (type) {
      case 'DINHEIRO':
        return <Badge variant="outline">Dinheiro</Badge>
      case 'CARTAO':
        return <Badge variant="outline">Cartão</Badge>
      case 'PIX':
        return <Badge variant="outline">PIX</Badge>
      case 'FIADO':
        return <Badge className="bg-orange-100 text-orange-800">Fiado</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getExpenseCategoryBadge = (category: string) => {
    switch (category) {
      case 'COMBUSTIVEL':
        return <Badge className="bg-red-100 text-red-800">Combustível</Badge>
      case 'MANUTENCAO':
        return <Badge className="bg-yellow-100 text-yellow-800">Manutenção</Badge>
      case 'ALIMENTACAO':
        return <Badge className="bg-green-100 text-green-800">Alimentação</Badge>
      case 'OUTROS':
        return <Badge className="bg-gray-100 text-gray-800">Outros</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  const handleViewDetails = (employee: EmployeeReport) => {
    setSelectedEmployee(employee)
    setIsDetailDialogOpen(true)
  }

  const handleApplyFilters = () => {
    // Validar datas
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate)
      const endDate = new Date(filters.endDate)
      
      if (startDate > endDate) {
        alert('A data inicial não pode ser maior que a data final')
        return
      }
    }

    fetchReport()
    setIsFilterDialogOpen(false)
  }

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      employeeId: 'todos'
    })
    setReportData(null)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">Relatórios de vendas e gastos por funcionário</p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Filtros do Relatório</DialogTitle>
                  <DialogDescription>
                    Defina o período e funcionário para o relatório
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Data Inicial</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">Data Final</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="employee">Funcionário (Opcional)</Label>
                    <Select value={filters.employeeId} onValueChange={(value) => setFilters({...filters, employeeId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os funcionários" />
              </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os funcionários</SelectItem>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
            </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleClearFilters}>
                    Limpar
                  </Button>
                  <Button onClick={handleApplyFilters}>
                    Aplicar Filtros
            </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={fetchReport} disabled={isLoading}>
              {isLoading ? 'Carregando...' : 'Gerar Relatório'}
            </Button>
          </div>
        </div>

        {!reportData && !isLoading && (
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum relatório gerado</h3>
              <p className="text-gray-600 mb-4">Clique em "Gerar Relatório" para visualizar os dados dos funcionários</p>
              <Button onClick={fetchReport}>
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>
        )}

        {reportData && (
          <>
            {/* Informações do período */}
            <Card>
              <CardHeader>
                <CardTitle>Período do Relatório</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm">
                  <div>
                    <span className="font-medium">Data inicial:</span>{' '}
                    {reportData.period.startDate ? 
                      new Date(reportData.period.startDate).toLocaleDateString('pt-BR') : 
                      'Não definida'
                    }
                  </div>
                  <div>
                    <span className="font-medium">Data final:</span>{' '}
                    {reportData.period.endDate ? 
                      new Date(reportData.period.endDate).toLocaleDateString('pt-BR') : 
                      'Não definida'
                    }
                  </div>
                  <div>
                    <span className="font-medium">Funcionários:</span>{' '}
                    {reportData.summary.totalEmployees}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cards de resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(reportData.summary.totalSales)}</div>
              <p className="text-xs text-muted-foreground">
                    {reportData.summary.totalEmployees} funcionários
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Gastos</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                  <div className="text-2xl font-bold text-red-600">{formatCurrency(reportData.summary.totalExpenses)}</div>
              <p className="text-xs text-muted-foreground">
                    Gastos operacionais
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resultado Líquido</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                  <div className={`text-2xl font-bold ${reportData.summary.totalNetResult >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(reportData.summary.totalNetResult)}
              </div>
              <p className="text-xs text-muted-foreground">
                    Vendas - Gastos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                  <div className="text-2xl font-bold">{reportData.summary.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                    Total de funcionários
              </p>
            </CardContent>
          </Card>
        </div>

            {/* Tabela de funcionários */}
          <Card>
            <CardHeader>
                <CardTitle>Relatório por Funcionário</CardTitle>
              <CardDescription>
                  Vendas e gastos detalhados por funcionário
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Funcionário</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Vendas</TableHead>
                      <TableHead>Gastos</TableHead>
                      <TableHead>Resultado</TableHead>
                      <TableHead>Transações</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{getRoleBadge(employee.role)}</TableCell>
                        <TableCell className="text-green-600 font-medium">
                          {formatCurrency(employee.totalSales)}
                        </TableCell>
                        <TableCell className="text-red-600 font-medium">
                          {formatCurrency(employee.totalExpenses)}
                        </TableCell>
                        <TableCell className={`font-medium ${employee.netResult >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(employee.netResult)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Vendas: {employee.salesCount}</div>
                            <div>Gastos: {employee.expensesCount}</div>
                </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(employee)}
                          >
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </CardContent>
          </Card>
          </>
        )}

        {/* Modal de detalhes */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes - {selectedEmployee?.name}</DialogTitle>
              <DialogDescription>
                Vendas e gastos detalhados do funcionário
              </DialogDescription>
            </DialogHeader>
            
            {selectedEmployee && (
              <div className="space-y-6">
                {/* Resumo */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(selectedEmployee.totalSales)}</div>
                    <div className="text-sm text-gray-600">Total de Vendas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{formatCurrency(selectedEmployee.totalExpenses)}</div>
                    <div className="text-sm text-gray-600">Total de Gastos</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${selectedEmployee.netResult >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(selectedEmployee.netResult)}
                    </div>
                    <div className="text-sm text-gray-600">Resultado Líquido</div>
                  </div>
                </div>
                
                {/* Vendas */}
                    <div>
                  <h3 className="text-lg font-semibold mb-3">Vendas ({selectedEmployee.sales.length})</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Qtd</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Pagamento</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedEmployee.sales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell>{sale.product}</TableCell>
                          <TableCell>{sale.customer}</TableCell>
                          <TableCell>{sale.quantity}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(sale.totalPrice)}</TableCell>
                          <TableCell>{getPaymentTypeBadge(sale.paymentType)}</TableCell>
                          <TableCell>{new Date(sale.date).toLocaleDateString('pt-BR')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Gastos */}
                    <div>
                  <h3 className="text-lg font-semibold mb-3">Gastos ({selectedEmployee.expenses.length})</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Veículo</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedEmployee.expenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{expense.description}</TableCell>
                          <TableCell>{getExpenseCategoryBadge(expense.category)}</TableCell>
                          <TableCell>{expense.vehicle}</TableCell>
                          <TableCell className="font-medium text-red-600">{formatCurrency(expense.amount)}</TableCell>
                          <TableCell>{new Date(expense.date).toLocaleDateString('pt-BR')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}