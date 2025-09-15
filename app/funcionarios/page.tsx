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
import { Plus, Search, UserCheck, Users, Truck, UserPlus, Edit, Save } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import { useRouter } from 'next/navigation'

interface Employee {
  id: string
  name: string
  email: string
  role: 'ATENDENTE' | 'ADMINISTRATIVO'
  phone?: string
  address?: string
  hireDate: string
  isActive: boolean
  vehicleId?: string
  vehicleName?: string
}

interface Vehicle {
  id: string
  name: string
  plate: string
  model?: string
  year?: number
  isActive: boolean
  employeeId?: string
  employeeName?: string
}

export default function Funcionarios() {
  const { canManageEmployees, loading } = usePermissions()
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !canManageEmployees) {
      router.push('/')
    }
  }, [canManageEmployees, loading, router])

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
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false)
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: 'ATENDENTE',
    phone: '',
    address: ''
  })

  const [newVehicle, setNewVehicle] = useState({
    name: '',
    plate: '',
    model: '',
    year: new Date().getFullYear()
  })

  const [editEmployee, setEditEmployee] = useState({
    name: '',
    email: '',
    role: 'ATENDENTE',
    phone: '',
    address: ''
  })

  useEffect(() => {
    if (canManageEmployees) {
      fetchEmployees()
      fetchVehicles()
    }
  }, [canManageEmployees])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      if (response.ok) {
        const data = await response.json()
        setEmployees(data.map((employee: any) => ({
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          phone: employee.phone,
          address: employee.address,
          hireDate: new Date(employee.createdAt).toLocaleDateString('pt-BR'),
          isActive: true, // Assumindo que todos estão ativos
          vehicleId: employee.vehicles?.[0]?.id,
          vehicleName: employee.vehicles?.[0] ? `${employee.vehicles[0].name} - ${employee.vehicles[0].plate}` : undefined
        })))
      } else {
        console.error('Error fetching employees')
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      if (response.ok) {
        const data = await response.json()
        setVehicles(data.map((vehicle: any) => ({
          id: vehicle.id,
          name: vehicle.name,
          plate: vehicle.plate,
          model: vehicle.model,
          year: vehicle.year,
          isActive: vehicle.isActive,
          employeeId: vehicle.user?.id,
          employeeName: vehicle.user?.name
        })))
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
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

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge className="bg-green-100 text-green-800">Ativo</Badge> : 
      <Badge className="bg-red-100 text-red-800">Inativo</Badge>
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || employee.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleCreateEmployee = async () => {
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      })

      if (response.ok) {
        await fetchEmployees()
        setIsEmployeeDialogOpen(false)
        setNewEmployee({
          name: '',
          email: '',
          role: 'ATENDENTE',
          phone: '',
          address: ''
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar funcionário')
      }
    } catch (error) {
      console.error('Error creating employee:', error)
      alert('Erro ao criar funcionário')
    }
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setEditEmployee({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      phone: employee.phone || '',
      address: employee.address || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateEmployee = async () => {
    if (!editingEmployee) return
    
    try {
      const response = await fetch('/api/employees', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingEmployee.id,
          name: editEmployee.name,
          email: editEmployee.email,
          role: editEmployee.role,
          phone: editEmployee.phone,
          address: editEmployee.address,
        }),
      })

      if (response.ok) {
        await fetchEmployees()
        setIsEditDialogOpen(false)
        setEditingEmployee(null)
        setEditEmployee({
          name: '',
          email: '',
          role: 'ATENDENTE',
          phone: '',
          address: ''
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao atualizar funcionário')
      }
    } catch (error) {
      console.error('Error updating employee:', error)
      alert('Erro ao atualizar funcionário')
    }
  }

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

  const totalEmployees = employees.length
  const activeEmployees = employees.filter(e => e.isActive).length
  const administrativeEmployees = employees.filter(e => e.role === 'ADMINISTRATIVO').length
  const employeesWithVehicles = employees.filter(e => e.vehicleId).length

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Funcionários</h1>
            <p className="text-gray-600">Gestão de funcionários e veículos</p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Novo Funcionário
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Novo Funcionário</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo funcionário no sistema
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Cargo</Label>
                    <Select value={newEmployee.role} onValueChange={(value) => setNewEmployee({...newEmployee, role: value as 'ATENDENTE' | 'ADMINISTRATIVO'})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ATENDENTE">Atendente</SelectItem>
                        <SelectItem value="ADMINISTRATIVO">Administrativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={newEmployee.address}
                      onChange={(e) => setNewEmployee({...newEmployee, address: e.target.value})}
                      placeholder="Endereço completo"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEmployeeDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateEmployee}>
                    Cadastrar Funcionário
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Truck className="mr-2 h-4 w-4" />
                  Novo Veículo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Novo Veículo</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo veículo no sistema
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
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                Funcionários cadastrados
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Funcionários Ativos</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEmployees}</div>
              <p className="text-xs text-muted-foreground">
                {((activeEmployees / totalEmployees) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrativos</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{administrativeEmployees}</div>
              <p className="text-xs text-muted-foreground">
                Acesso administrativo
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Veículos</CardTitle>
              <Truck className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employeesWithVehicles}</div>
              <p className="text-xs text-muted-foreground">
                Funcionários com veículo
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
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os cargos</SelectItem>
                    <SelectItem value="ATENDENTE">Atendente</SelectItem>
                    <SelectItem value="ADMINISTRATIVO">Administrativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de funcionários */}
        <Card>
          <CardHeader>
            <CardTitle>Funcionários</CardTitle>
            <CardDescription>
              Lista de todos os funcionários cadastrados
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
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Admissão</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{getRoleBadge(employee.role)}</TableCell>
                      <TableCell>{employee.phone || '-'}</TableCell>
                      <TableCell>{employee.vehicleName || '-'}</TableCell>
                      <TableCell>{getStatusBadge(employee.isActive)}</TableCell>
                      <TableCell>{new Date(employee.hireDate).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Tabela de veículos */}
        <Card>
          <CardHeader>
            <CardTitle>Veículos</CardTitle>
            <CardDescription>
              Lista de todos os veículos cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.name}</TableCell>
                    <TableCell>{vehicle.plate}</TableCell>
                    <TableCell>{vehicle.model || '-'}</TableCell>
                    <TableCell>{vehicle.year || '-'}</TableCell>
                    <TableCell>{vehicle.employeeName || 'Não atribuído'}</TableCell>
                    <TableCell>{getStatusBadge(vehicle.isActive)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal de Edição de Funcionário */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Funcionário</DialogTitle>
              <DialogDescription>
                Edite os dados do funcionário
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={editEmployee.name}
                  onChange={(e) => setEditEmployee({...editEmployee, name: e.target.value})}
                  placeholder="Nome completo"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editEmployee.email}
                  onChange={(e) => setEditEmployee({...editEmployee, email: e.target.value})}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Cargo</Label>
                <Select value={editEmployee.role} onValueChange={(value) => setEditEmployee({...editEmployee, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATENDENTE">Atendente</SelectItem>
                    <SelectItem value="ADMINISTRATIVO">Administrativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input
                  id="edit-phone"
                  value={editEmployee.phone}
                  onChange={(e) => setEditEmployee({...editEmployee, phone: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Endereço</Label>
                <Input
                  id="edit-address"
                  value={editEmployee.address}
                  onChange={(e) => setEditEmployee({...editEmployee, address: e.target.value})}
                  placeholder="Endereço completo"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateEmployee}>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
