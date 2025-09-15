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
import { Plus, Search, Truck, Wrench, Fuel, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import { useRouter } from 'next/navigation'
import { VehicleAssignment } from '@/components/VehicleAssignment'

interface Vehicle {
  id: string
  name: string
  plate: string
  model?: string
  year?: number
  isActive: boolean
  user?: {
    id: string
    name: string
    email: string
  }
  totalExpenses: number
}

interface VehicleExpense {
  id: string
  vehicleId: string
  description: string
  amount: number
  category: 'COMBUSTIVEL' | 'MANUTENCAO' | 'OUTROS'
  expenseDate: string
  user: {
    name: string
  }
  vehicle: {
    name: string
    plate: string
  }
}

export default function Veiculos() {
  const { canManageVehicles, loading } = usePermissions()
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [expenses, setExpenses] = useState<VehicleExpense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false)
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const [newVehicle, setNewVehicle] = useState({
    name: '',
    plate: '',
    model: '',
    year: new Date().getFullYear()
  })

  const [newExpense, setNewExpense] = useState({
    vehicleId: '',
    description: '',
    amount: 0,
    category: 'COMBUSTIVEL' as 'COMBUSTIVEL' | 'MANUTENCAO' | 'OUTROS',
    notes: ''
  })

  useEffect(() => {
    if (!loading && !canManageVehicles) {
      router.push('/')
    } else if (canManageVehicles) {
      fetchVehicles()
      fetchExpenses()
    }
  }, [canManageVehicles, loading, router])

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      if (response.ok) {
        const data = await response.json()
        setVehicles(data)
      } else {
        console.error('Error fetching vehicles')
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses')
      if (response.ok) {
        const data = await response.json()
        setExpenses(data)
      } else {
        console.error('Error fetching expenses')
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge className="bg-green-100 text-green-800">Ativo</Badge> : 
      <Badge className="bg-red-100 text-red-800">Inativo</Badge>
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'COMBUSTIVEL':
        return <Badge className="bg-blue-100 text-blue-800">Combustível</Badge>
      case 'MANUTENCAO':
        return <Badge className="bg-red-100 text-red-800">Manutenção</Badge>
      case 'OUTROS':
        return <Badge className="bg-gray-100 text-gray-800">Outros</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vehicle.model && vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && vehicle.isActive) ||
                         (filterStatus === 'inactive' && !vehicle.isActive)
    return matchesSearch && matchesStatus
  })

  const handleCreateVehicle = async () => {
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVehicle),
      })

      if (response.ok) {
        await fetchVehicles()
        setIsVehicleDialogOpen(false)
        setNewVehicle({
          name: '',
          plate: '',
          model: '',
          year: new Date().getFullYear()
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar veículo')
      }
    } catch (error) {
      console.error('Error creating vehicle:', error)
      alert('Erro ao criar veículo')
    }
  }

  const handleCreateExpense = async () => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      })

      if (response.ok) {
        await fetchExpenses()
        setIsExpenseDialogOpen(false)
        setNewExpense({
          vehicleId: '',
          description: '',
          amount: 0,
          category: 'COMBUSTIVEL',
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

  const totalVehicles = vehicles.length
  const activeVehicles = vehicles.filter(v => v.isActive).length
  const totalExpenses = vehicles.reduce((sum, vehicle) => sum + vehicle.totalExpenses, 0)

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando...</div>
        </div>
      </Layout>
    )
  }

  if (!canManageVehicles) {
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Veículos</h1>
            <p className="text-gray-600">Gestão de frota e despesas veiculares</p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Veículo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Novo Veículo</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo veículo na frota
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={newVehicle.name}
                      onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})}
                      placeholder="Nome do veículo"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="plate">Placa</Label>
                    <Input
                      id="plate"
                      value={newVehicle.plate}
                      onChange={(e) => setNewVehicle({...newVehicle, plate: e.target.value.toUpperCase()})}
                      placeholder="ABC-1234"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="model">Modelo</Label>
                    <Input
                      id="model"
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                      placeholder="Modelo do veículo"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="year">Ano</Label>
                    <Input
                      id="year"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={newVehicle.year || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || new Date().getFullYear()
                        setNewVehicle({...newVehicle, year: value})
                      }}
                      placeholder="2024"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsVehicleDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateVehicle}>
                    Cadastrar Veículo
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Wrench className="mr-2 h-4 w-4" />
                  Nova Despesa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Nova Despesa Veicular</DialogTitle>
                  <DialogDescription>
                    Registre uma despesa relacionada a um veículo
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="vehicle">Veículo</Label>
                    <Select value={newExpense.vehicleId} onValueChange={(value) => setNewExpense({...newExpense, vehicleId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o veículo" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.filter(v => v.isActive).map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.name} - {vehicle.plate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                    <Select value={newExpense.category} onValueChange={(value) => setNewExpense({...newExpense, category: value as 'COMBUSTIVEL' | 'MANUTENCAO' | 'OUTROS'})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COMBUSTIVEL">Combustível</SelectItem>
                        <SelectItem value="MANUTENCAO">Manutenção</SelectItem>
                        <SelectItem value="OUTROS">Outros</SelectItem>
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
                  <Button variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateExpense} disabled={!newExpense.vehicleId || newExpense.amount <= 0}>
                    Registrar Despesa
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
              <Truck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVehicles}</div>
              <p className="text-xs text-muted-foreground">
                Veículos na frota
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Veículos Ativos</CardTitle>
              <Truck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeVehicles}</div>
              <p className="text-xs text-muted-foreground">
                {totalVehicles > 0 ? ((activeVehicles / totalVehicles) * 100).toFixed(1) : 0}% da frota
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
              <Fuel className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
              <p className="text-xs text-muted-foreground">
                Este mês
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
                    placeholder="Buscar por nome, placa ou modelo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de veículos */}
        <Card>
          <CardHeader>
            <CardTitle>Frota de Veículos</CardTitle>
            <CardDescription>
              Lista de todos os veículos da frota
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
                    <TableHead>Veículo</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Ano</TableHead>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Despesas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.name}</TableCell>
                      <TableCell>{vehicle.plate}</TableCell>
                      <TableCell>{vehicle.model || '-'}</TableCell>
                      <TableCell>{vehicle.year || '-'}</TableCell>
                      <TableCell>
                        {vehicle.user ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            {vehicle.user.name}
                          </Badge>
                        ) : (
                          <span className="text-gray-500">Não atribuído</span>
                        )}
                      </TableCell>
                      <TableCell className="text-red-600 font-medium">
                        {formatCurrency(vehicle.totalExpenses)}
                      </TableCell>
                      <TableCell>{getStatusBadge(vehicle.isActive)}</TableCell>
                      <TableCell>
                        <VehicleAssignment vehicle={vehicle} onUpdate={fetchVehicles} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Histórico de despesas veiculares */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Despesas Veiculares</CardTitle>
            <CardDescription>
              Últimas despesas registradas por veículo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Usuário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">
                      {expense.vehicle ? `${expense.vehicle.name} - ${expense.vehicle.plate}` : 'Sem veículo'}
                    </TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell className="text-red-600 font-medium">{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>{getCategoryBadge(expense.category)}</TableCell>
                    <TableCell>{new Date(expense.expenseDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{expense.user.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}