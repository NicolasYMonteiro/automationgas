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
import { Plus, Search, Filter, TrendingDown } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  user: string
  vehicle?: string
  notes?: string
}

export default function Despesas() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: 0,
    category: 'OUTROS',
    vehicle: 'nenhum',
    notes: ''
  })

  useEffect(() => {
    fetchExpenses()
    fetchVehicles()
  }, [])

  const fetchExpenses = async () => {
    try {
      console.log('Fetching expenses...')
      const response = await fetch('/api/expenses')
      console.log('Expenses response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Expenses data received:', data.length, 'expenses')
        setExpenses(data.map((expense: any) => ({
          id: expense.id,
          description: expense.description,
          amount: Number(expense.amount),
          category: expense.category,
          date: new Date(expense.createdAt).toLocaleString('pt-BR'),
          user: expense.user?.name || '',
          vehicle: expense.vehicle ? `${expense.vehicle.name} - ${expense.vehicle.plate}` : '',
          notes: expense.notes
        })))
      } else {
        console.error('Error fetching expenses:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      if (response.ok) {
        const data = await response.json()
        setVehicles(data)
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'COMBUSTIVEL':
        return <Badge className="bg-blue-100 text-blue-800">Combustível</Badge>
      case 'MANUTENCAO':
        return <Badge className="bg-red-100 text-red-800">Manutenção</Badge>
      case 'ALIMENTACAO':
        return <Badge className="bg-green-100 text-green-800">Alimentação</Badge>
      case 'OUTROS':
        return <Badge className="bg-gray-100 text-gray-800">Outros</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateExpense = async () => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: newExpense.description,
          amount: newExpense.amount,
          category: newExpense.category,
          vehicleId: newExpense.vehicle && newExpense.vehicle !== 'nenhum' ? newExpense.vehicle : null,
          notes: newExpense.notes,
        }),
      })

      if (response.ok) {
        await fetchExpenses()
        setIsDialogOpen(false)
        setNewExpense({
          description: '',
          amount: 0,
          category: 'OUTROS',
          vehicle: 'nenhum',
          notes: ''
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar despesa')
      }
    } catch (error) {
      console.error('Error creating expense:', error)
      alert('Erro ao criar despesa')
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const fuelExpenses = expenses.filter(e => e.category === 'COMBUSTIVEL').reduce((sum, e) => sum + e.amount, 0)
  const maintenanceExpenses = expenses.filter(e => e.category === 'MANUTENCAO').reduce((sum, e) => sum + e.amount, 0)

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Despesas</h1>
            <p className="text-gray-600">Controle de despesas e custos operacionais</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Despesa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nova Despesa</DialogTitle>
                <DialogDescription>
                  Registre uma nova despesa no sistema
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    placeholder="Descrição da despesa"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Valor</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newExpense.amount || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      setNewExpense({...newExpense, amount: value})
                    }}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={newExpense.category} onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COMBUSTIVEL">Combustível</SelectItem>
                      <SelectItem value="MANUTENCAO">Manutenção</SelectItem>
                      <SelectItem value="ALIMENTACAO">Alimentação</SelectItem>
                      <SelectItem value="OUTROS">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="vehicle">Veículo (opcional)</Label>
                  <Select value={newExpense.vehicle} onValueChange={(value) => setNewExpense({...newExpense, vehicle: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nenhum">Nenhum</SelectItem>
                      {vehicles.filter(v => v.isActive).map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} - {vehicle.plate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Input
                    id="notes"
                    value={newExpense.notes}
                    onChange={(e) => setNewExpense({...newExpense, notes: e.target.value})}
                    placeholder="Observações adicionais"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateExpense}>
                  Registrar Despesa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Combustível</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(fuelExpenses)}</div>
              <p className="text-xs text-muted-foreground">
                {((fuelExpenses / totalExpenses) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Manutenção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(maintenanceExpenses)}</div>
              <p className="text-xs text-muted-foreground">
                {((maintenanceExpenses / totalExpenses) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média por Dia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalExpenses / 15)}</div>
              <p className="text-xs text-muted-foreground">
                Últimos 15 dias
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por descrição ou usuário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="COMBUSTIVEL">Combustível</SelectItem>
                    <SelectItem value="MANUTENCAO">Manutenção</SelectItem>
                    <SelectItem value="ALIMENTACAO">Alimentação</SelectItem>
                    <SelectItem value="OUTROS">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de despesas */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Despesas</CardTitle>
            <CardDescription>
              Lista de todas as despesas registradas
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Observações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.description}</TableCell>
                      <TableCell className="text-red-600 font-medium">{formatCurrency(expense.amount)}</TableCell>
                      <TableCell>{getCategoryBadge(expense.category)}</TableCell>
                      <TableCell>{expense.vehicle || '-'}</TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{expense.user}</TableCell>
                      <TableCell>{expense.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
