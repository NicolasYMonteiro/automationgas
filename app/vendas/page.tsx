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
import { Plus, Search, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Sale {
  id: string
  customer: string
  product: string
  quantity: number
  totalPrice: number
  paymentType: string
  status: string
  fiadoCode?: string
  date: string
  user: string
}

export default function Vendas() {
  const [sales, setSales] = useState<Sale[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const [newSale, setNewSale] = useState({
    customer: '',
    product: '',
    quantity: 1,
    paymentType: 'DINHEIRO',
    notes: '',
    isCredit: false
  })

  useEffect(() => {
    fetchSales()
    fetchProducts()
    fetchCustomers()
  }, [])

  const fetchSales = async () => {
    try {
      console.log('Fetching sales...')
      const response = await fetch('/api/sales')
      console.log('Sales response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Sales data received:', data.length, 'sales')
        setSales(data.map((sale: any) => ({
          id: sale.id,
          customer: sale.customer?.name || 'Consumidor Final',
          product: sale.product?.name || '',
          quantity: sale.quantity,
          totalPrice: Number(sale.totalPrice),
          paymentType: sale.paymentType,
          status: sale.status,
          fiadoCode: sale.fiadoCode,
          date: new Date(sale.createdAt).toLocaleString('pt-BR'),
          user: sale.user?.name || ''
        })))
      } else {
        console.error('Error fetching sales:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching sales:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
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
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800">Concluída</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || sale.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCreateSale = async () => {
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: newSale.product,
          customerName: newSale.customer || 'Consumidor Final',
          quantity: newSale.quantity,
          paymentType: newSale.isCredit ? 'FIADO' : newSale.paymentType,
          notes: newSale.notes,
          isCredit: newSale.isCredit,
        }),
      })

      if (response.ok) {
        await fetchSales()
        setIsDialogOpen(false)
        setNewSale({
          customer: '',
          product: '',
          quantity: 1,
          paymentType: 'DINHEIRO',
          notes: '',
          isCredit: false
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar venda')
      }
    } catch (error) {
      console.error('Error creating sale:', error)
      alert('Erro ao criar venda')
    }
  }

  const totalSales = sales
    .filter(sale => sale.status === 'COMPLETED')
    .reduce((sum, sale) => sum + sale.totalPrice, 0)
  const pendingSalesTotal = sales
    .filter(sale => sale.status === 'PENDING')
    .reduce((sum, sale) => sum + sale.totalPrice, 0)
  const completedSales = sales.filter(sale => sale.status === 'COMPLETED').length
  const pendingSales = sales.filter(sale => sale.status === 'PENDING').length

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
            <p className="text-gray-600">Controle de vendas e transações</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Venda
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nova Venda</DialogTitle>
                <DialogDescription>
                  Registre uma nova venda no sistema
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="customer">
                    Cliente {newSale.isCredit && <span className="text-red-500">*</span>}
                  </Label>
                  <Select 
                    value={newSale.customer} 
                    onValueChange={(value) => setNewSale({...newSale, customer: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={newSale.isCredit ? "Selecione um cliente (obrigatório para fiado)" : "Selecione um cliente (opcional)"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consumidor-final">Consumidor Final</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.name}>
                          {customer.name} - {customer.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {newSale.isCredit && !newSale.customer && (
                    <p className="text-sm text-red-500">Cliente é obrigatório para vendas fiadas</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="product">Produto</Label>
                  <Select value={newSale.product} onValueChange={(value) => setNewSale({...newSale, product: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - R$ {Number(product.price).toFixed(2)} (Estoque: {product.stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={newSale.quantity || ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1
                      setNewSale({...newSale, quantity: value})
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="paymentType">Forma de Pagamento</Label>
                  <Select 
                    value={newSale.isCredit ? 'FIADO' : newSale.paymentType} 
                    onValueChange={(value) => {
                      if (value === 'FIADO') {
                        setNewSale({...newSale, paymentType: 'FIADO', isCredit: true, customer: ''})
                      } else {
                        setNewSale({...newSale, paymentType: value, isCredit: false})
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                      <SelectItem value="CARTAO">Cartão</SelectItem>
                      <SelectItem value="PIX">PIX</SelectItem>
                      <SelectItem value="FIADO">Fiado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Input
                    id="notes"
                    value={newSale.notes}
                    onChange={(e) => setNewSale({...newSale, notes: e.target.value})}
                    placeholder="Observações adicionais"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateSale}
                  disabled={newSale.isCredit && !newSale.customer}
                >
                  Registrar Venda
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedSales}</div>
              <p className="text-xs text-muted-foreground">
                {((completedSales / sales.length) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingSales}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando confirmação
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Fiado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(pendingSalesTotal)}</div>
              <p className="text-xs text-muted-foreground">
                A receber de clientes
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
                    placeholder="Buscar por cliente, produto, código fiado ou vendedor..."
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
                    <SelectItem value="COMPLETED">Concluídas</SelectItem>
                    <SelectItem value="PENDING">Pendentes</SelectItem>
                    <SelectItem value="CANCELLED">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de vendas */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Vendas</CardTitle>
            <CardDescription>
              Lista de todas as vendas registradas
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
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Código Fiado</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.customer}</TableCell>
                      <TableCell>{sale.product}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell>{formatCurrency(sale.totalPrice)}</TableCell>
                      <TableCell>{getPaymentTypeBadge(sale.paymentType)}</TableCell>
                      <TableCell>
                        {sale.fiadoCode ? (
                          <Badge variant="outline" className="font-mono text-xs">
                            {sale.fiadoCode}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(sale.status)}</TableCell>
                      <TableCell className="font-medium text-blue-600">{sale.user}</TableCell>
                      <TableCell>{sale.date}</TableCell>
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
