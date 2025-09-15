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
import { Plus, Search, Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  minStock: number
  lastUpdate: string
  status: 'OK' | 'BAIXO' | 'CRITICO'
}

interface InventoryMovement {
  id: string
  productId: string
  productName: string
  type: 'ENTRADA' | 'SAIDA' | 'AJUSTE'
  quantity: number
  date: string
  user: string
  notes?: string
}

export default function Estoque() {
  const [products, setProducts] = useState<Product[]>([])
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    minStock: 5
  })

  const [newMovement, setNewMovement] = useState({
    productId: '',
    type: 'ENTRADA',
    quantity: 0,
    notes: ''
  })

  useEffect(() => {
    fetchProducts()
    fetchMovements()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          stock: Number(product.stock),
          minStock: Number(product.minStock),
          lastUpdate: new Date(product.updatedAt).toLocaleString('pt-BR'),
          status: product.status
        })))
      } else {
        console.error('Error fetching products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMovements = async () => {
    try {
      const response = await fetch('/api/inventory')
      if (response.ok) {
        const data = await response.json()
        setMovements(data.map((movement: any) => ({
          id: movement.id,
          productId: movement.productId,
          productName: movement.product?.name || '',
          type: movement.type,
          quantity: movement.quantity,
          date: new Date(movement.createdAt).toLocaleString('pt-BR'),
          user: 'Sistema', // Poderia ser expandido para incluir usuário
          notes: movement.notes
        })))
      }
    } catch (error) {
      console.error('Error fetching movements:', error)
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
      case 'OK':
        return <Badge className="bg-green-100 text-green-800">OK</Badge>
      case 'BAIXO':
        return <Badge className="bg-yellow-100 text-yellow-800">Baixo</Badge>
      case 'CRITICO':
        return <Badge className="bg-red-100 text-red-800">Crítico</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMovementTypeBadge = (type: string) => {
    switch (type) {
      case 'ENTRADA':
        return <Badge className="bg-green-100 text-green-800">Entrada</Badge>
      case 'SAIDA':
        return <Badge className="bg-red-100 text-red-800">Saída</Badge>
      case 'AJUSTE':
        return <Badge className="bg-blue-100 text-blue-800">Ajuste</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCreateProduct = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      })

      if (response.ok) {
        await fetchProducts()
        setIsProductDialogOpen(false)
        setNewProduct({
          name: '',
          description: '',
          price: 0,
          stock: 0,
          minStock: 5
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar produto')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Erro ao criar produto')
    }
  }

  const handleCreateMovement = async () => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovement),
      })

      if (response.ok) {
        await fetchProducts()
        await fetchMovements()
        setIsMovementDialogOpen(false)
        setNewMovement({
          productId: '',
          type: 'ENTRADA',
          quantity: 0,
          notes: ''
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar movimentação')
      }
    } catch (error) {
      console.error('Error creating movement:', error)
      alert('Erro ao criar movimentação')
    }
  }

  const totalProducts = products.length
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0)
  const totalValue = products.reduce((sum, product) => sum + (product.stock * product.price), 0)
  const lowStockProducts = products.filter(p => p.status === 'BAIXO' || p.status === 'CRITICO').length

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Estoque</h1>
            <p className="text-gray-600">Controle de produtos e movimentações</p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Novo Produto</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo produto no estoque
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Nome do produto"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Descrição do produto"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Preço</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newProduct.price || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        setNewProduct({...newProduct, price: value})
                      }}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Estoque Inicial</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={newProduct.stock || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0
                        setNewProduct({...newProduct, stock: value})
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minStock">Estoque Mínimo</Label>
                    <Input
                      id="minStock"
                      type="number"
                      min="0"
                      value={newProduct.minStock || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0
                        setNewProduct({...newProduct, minStock: value})
                      }}
                      placeholder="5"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateProduct}>
                    Cadastrar Produto
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isMovementDialogOpen} onOpenChange={setIsMovementDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Package className="mr-2 h-4 w-4" />
                  Movimentar Estoque
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Movimentar Estoque</DialogTitle>
                  <DialogDescription>
                    Registre uma entrada, saída ou ajuste no estoque
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="product">Produto</Label>
                    <Select value={newMovement.productId} onValueChange={(value) => setNewMovement({...newMovement, productId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - Estoque: {product.stock}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo de Movimento</Label>
                    <Select value={newMovement.type} onValueChange={(value) => setNewMovement({...newMovement, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ENTRADA">Entrada</SelectItem>
                        <SelectItem value="SAIDA">Saída</SelectItem>
                        <SelectItem value="AJUSTE">Ajuste</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantidade</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newMovement.quantity || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1
                        setNewMovement({...newMovement, quantity: value})
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Observações</Label>
                    <Input
                      id="notes"
                      value={newMovement.notes}
                      onChange={(e) => setNewMovement({...newMovement, notes: e.target.value})}
                      placeholder="Observações sobre o movimento"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsMovementDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateMovement} disabled={!newMovement.productId || newMovement.quantity <= 0}>
                    Registrar Movimento
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
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Produtos cadastrados
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total em Estoque</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStock}</div>
              <p className="text-xs text-muted-foreground">
                Unidades disponíveis
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                Valor do estoque
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">
                Produtos com estoque baixo
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
                    placeholder="Buscar por nome ou descrição..."
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
                    <SelectItem value="OK">OK</SelectItem>
                    <SelectItem value="BAIXO">Baixo</SelectItem>
                    <SelectItem value="CRITICO">Crítico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de produtos */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos em Estoque</CardTitle>
            <CardDescription>
              Lista de todos os produtos cadastrados
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
                    <TableHead>Produto</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Mínimo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Última Atualização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{formatCurrency(product.price)}</TableCell>
                      <TableCell className="font-medium">
                        {product.stock}
                      </TableCell>
                      <TableCell>{product.minStock}</TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(product.stock * product.price)}
                      </TableCell>
                      <TableCell>{product.lastUpdate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Histórico de movimentações */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Movimentações</CardTitle>
            <CardDescription>
              Últimas movimentações do estoque
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell className="font-medium">{movement.productName}</TableCell>
                    <TableCell>{getMovementTypeBadge(movement.type)}</TableCell>
                    <TableCell className={`font-medium ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                    </TableCell>
                    <TableCell>{movement.date}</TableCell>
                    <TableCell>{movement.user}</TableCell>
                    <TableCell>{movement.notes || '-'}</TableCell>
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
