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
import { Plus, Search, UserPlus, CreditCard, Edit, Save, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Customer {
  id: string
  name: string
  code: string
  phone?: string
  address?: string
  creditLimit?: number
  totalDebt: number
  lastPayment?: string
  status: 'ATIVO' | 'BLOQUEADO'
}

interface CreditPayment {
  id: string
  customerId: string
  amount: number
  date: string
  notes?: string
}

export default function Fiados() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [payments, setPayments] = useState<CreditPayment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    code: '',
    phone: '',
    address: '',
    creditLimit: 0
  })

  const [newPayment, setNewPayment] = useState({
    amount: 0,
    notes: ''
  })

  const [editCustomer, setEditCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    creditLimit: 0
  })

  useEffect(() => {
    fetchCustomers()
    fetchPayments()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.map((customer: any) => ({
          id: customer.id,
          name: customer.name,
          code: customer.code,
          phone: customer.phone,
          address: customer.address,
          creditLimit: customer.creditLimit,
          totalDebt: customer.totalDebt,
          lastPayment: customer.lastPayment,
          status: customer.status
        })))
      } else {
        console.error('Error fetching customers')
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/credit-payments')
      if (response.ok) {
        const data = await response.json()
        setPayments(data.map((payment: any) => ({
          id: payment.id,
          customerId: payment.customerId,
          amount: payment.amount,
          date: new Date(payment.paymentDate).toLocaleString('pt-BR'),
          notes: payment.notes
        })))
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case 'BLOQUEADO':
        return <Badge className="bg-red-100 text-red-800">Bloqueado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDebtStatus = (debt: number, limit?: number) => {
    if (debt === 0) {
      return <Badge className="bg-green-100 text-green-800">Em dia</Badge>
    }
    if (limit && debt > limit) {
      return <Badge className="bg-red-100 text-red-800">Limite excedido</Badge>
    }
    return <Badge className="bg-yellow-100 text-yellow-800">Em débito</Badge>
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCreateCustomer = async () => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      })

      if (response.ok) {
        await fetchCustomers()
        setIsCustomerDialogOpen(false)
        setNewCustomer({
          name: '',
          code: '',
          phone: '',
          address: '',
          creditLimit: 0
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar cliente')
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      alert('Erro ao criar cliente')
    }
  }

  const handleCreatePayment = async () => {
    if (!selectedCustomer) return
    
    try {
      const response = await fetch('/api/credit-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          amount: newPayment.amount,
          notes: newPayment.notes,
        }),
      })

      if (response.ok) {
        await fetchCustomers()
        await fetchPayments()
        setIsPaymentDialogOpen(false)
        setNewPayment({
          amount: 0,
          notes: ''
        })
        setSelectedCustomer(null)
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao registrar pagamento')
      }
    } catch (error) {
      console.error('Error creating payment:', error)
      alert('Erro ao registrar pagamento')
    }
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setEditCustomer({
      name: customer.name,
      phone: customer.phone || '',
      address: customer.address || '',
      creditLimit: customer.creditLimit || 0
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return
    
    try {
      const response = await fetch('/api/customers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingCustomer.id,
          name: editCustomer.name,
          phone: editCustomer.phone,
          address: editCustomer.address,
          creditLimit: editCustomer.creditLimit,
        }),
      })

      if (response.ok) {
        await fetchCustomers()
        setIsEditDialogOpen(false)
        setEditingCustomer(null)
        setEditCustomer({
          name: '',
          phone: '',
          address: '',
          creditLimit: 0
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao atualizar cliente')
      }
    } catch (error) {
      console.error('Error updating customer:', error)
      alert('Erro ao atualizar cliente')
    }
  }

  const totalDebt = customers.reduce((sum, customer) => sum + customer.totalDebt, 0)
  const activeCustomers = customers.filter(c => c.status === 'ATIVO').length
  const customersInDebt = customers.filter(c => c.totalDebt > 0).length
  const blockedCustomers = customers.filter(c => c.status === 'BLOQUEADO').length

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fiados</h1>
            <p className="text-gray-600">Controle de clientes e pagamentos a prazo</p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Novo Cliente</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo cliente no sistema
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                      placeholder="Nome completo do cliente"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="code">Código</Label>
                    <Input
                      id="code"
                      value={newCustomer.code}
                      onChange={(e) => setNewCustomer({...newCustomer, code: e.target.value})}
                      placeholder="Código único do cliente"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                      placeholder="Endereço completo"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="creditLimit">Limite de Crédito</Label>
                    <Input
                      id="creditLimit"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newCustomer.creditLimit || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        setNewCustomer({...newCustomer, creditLimit: value})
                      }}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateCustomer}>
                    Cadastrar Cliente
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Registrar Pagamento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Registrar Pagamento</DialogTitle>
                  <DialogDescription>
                    Registre um pagamento de cliente fiado
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="customer">Cliente</Label>
                    <Select onValueChange={(value) => {
                      const customer = customers.find(c => c.id === value)
                      setSelectedCustomer(customer || null)
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.filter(c => c.totalDebt > 0).map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} - {formatCurrency(customer.totalDebt)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedCustomer && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Débito atual:</strong> {formatCurrency(selectedCustomer.totalDebt)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Limite:</strong> {formatCurrency(selectedCustomer.creditLimit || 0)}
                      </p>
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Valor do Pagamento</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      max={selectedCustomer?.totalDebt || 0}
                      value={newPayment.amount || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        setNewPayment({...newPayment, amount: value})
                      }}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Observações</Label>
                    <Input
                      id="notes"
                      value={newPayment.notes}
                      onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                      placeholder="Observações sobre o pagamento"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreatePayment} disabled={!selectedCustomer || newPayment.amount <= 0}>
                    Registrar Pagamento
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Editar Cliente</DialogTitle>
                  <DialogDescription>
                    Edite os dados do cliente
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Nome</Label>
                    <Input
                      id="edit-name"
                      value={editCustomer.name}
                      onChange={(e) => setEditCustomer({...editCustomer, name: e.target.value})}
                      placeholder="Nome completo do cliente"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-phone">Telefone</Label>
                    <Input
                      id="edit-phone"
                      value={editCustomer.phone}
                      onChange={(e) => setEditCustomer({...editCustomer, phone: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-address">Endereço</Label>
                    <Input
                      id="edit-address"
                      value={editCustomer.address}
                      onChange={(e) => setEditCustomer({...editCustomer, address: e.target.value})}
                      placeholder="Endereço completo"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-creditLimit">Limite de Crédito</Label>
                    <Input
                      id="edit-creditLimit"
                      type="number"
                      step="0.01"
                      min="0"
                      value={editCustomer.creditLimit || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        setEditCustomer({...editCustomer, creditLimit: value})
                      }}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdateCustomer}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
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
              <CardTitle className="text-sm font-medium">Total em Débito</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt)}</div>
              <p className="text-xs text-muted-foreground">
                Valor total pendente
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCustomers}</div>
              <p className="text-xs text-muted-foreground">
                {((activeCustomers / customers.length) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Débito</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{customersInDebt}</div>
              <p className="text-xs text-muted-foreground">
                Clientes com pagamento pendente
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bloqueados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{blockedCustomers}</div>
              <p className="text-xs text-muted-foreground">
                Clientes com crédito bloqueado
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
                    placeholder="Buscar por nome ou código..."
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
                    <SelectItem value="ATIVO">Ativos</SelectItem>
                    <SelectItem value="BLOQUEADO">Bloqueados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de clientes */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes Fiados</CardTitle>
            <CardDescription>
              Lista de todos os clientes cadastrados
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
                    <TableHead>Cliente</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Débito</TableHead>
                    <TableHead>Limite</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Pagamento</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.code}</TableCell>
                      <TableCell>{customer.phone || '-'}</TableCell>
                      <TableCell className="font-medium">
                        {customer.totalDebt > 0 ? (
                          <span className="text-red-600">{formatCurrency(customer.totalDebt)}</span>
                        ) : (
                          <span className="text-green-600">R$ 0,00</span>
                        )}
                      </TableCell>
                      <TableCell>{formatCurrency(customer.creditLimit || 0)}</TableCell>
                      <TableCell>{getStatusBadge(customer.status)}</TableCell>
                      <TableCell>{customer.lastPayment || '-'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {getDebtStatus(customer.totalDebt, customer.creditLimit)}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Histórico de pagamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pagamentos</CardTitle>
            <CardDescription>
              Últimos pagamentos registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => {
                  const customer = customers.find(c => c.id === payment.customerId)
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{customer?.name || 'Cliente não encontrado'}</TableCell>
                      <TableCell className="text-green-600 font-medium">{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.notes || '-'}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
