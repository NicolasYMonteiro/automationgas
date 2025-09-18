import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { product: { name: { contains: search, mode: 'insensitive' } } },
        { fiadoCode: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        user: { select: { name: true } },
        product: { select: { name: true } },
        customer: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(sales)
  } catch (error) {
    console.error('Error fetching sales:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar se o userId está presente na sessão
    if (!session.user?.id) {
      console.error('User ID not found in session:', session)
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 401 })
    }

    // Buscar o usuário no banco para garantir que existe
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      console.error('User not found in database:', session.user.id)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

  const body = await request.json()
  const { productId, customerName, quantity, paymentType, notes, isCredit, price } = body

    // Buscar produto para obter o preço e validar estoque
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Verificar estoque
    if (product.stock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }

    // Usar o preço enviado pelo frontend, se fornecido, senão usar o preço do produto
    const unitPrice = typeof price === 'number' && !isNaN(price) && price > 0 ? price : Number(product.price)
    const totalPrice = unitPrice * quantity

    // Processar cliente - criar ou buscar cliente baseado no nome
    let customerId = null
    if (customerName && customerName !== 'Consumidor Final') {
      // Buscar cliente existente ou criar novo
      let customer = await prisma.customer.findFirst({
        where: { name: customerName }
      })

      if (!customer) {
        // Criar novo cliente com código único baseado no tipo de venda
        let customerCode
        if (isCredit) {
          // Para vendas fiadas, usar código automático FIADO
          customerCode = `FIADO-${Date.now()}`
        } else {
          // Para vendas normais, usar código CLI
          customerCode = `CLI-${Date.now()}`
        }
        
        customer = await prisma.customer.create({
          data: {
            name: customerName,
            code: customerCode,
          }
        })
      }
      customerId = customer.id
    }

    // Gerar código único de 6 dígitos para vendas fiadas
    let fiadoCode = null
    if (paymentType === 'FIADO') {
      let isUnique = false
      let attempts = 0
      
      while (!isUnique && attempts < 10) {
        // Gerar código de 6 dígitos
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        
        // Verificar se o código já existe
        const existingSale = await prisma.sale.findUnique({
          where: { fiadoCode: code }
        })
        
        if (!existingSale) {
          fiadoCode = code
          isUnique = true
        }
        attempts++
      }
      
      if (!isUnique) {
        return NextResponse.json({ error: 'Não foi possível gerar código único para a venda fiada' }, { status: 500 })
      }
    }

    console.log('Creating sale with data:', {
      quantity,
      totalPrice,
      paymentType,
      notes,
      userId: session.user.id,
      productId,
      customerId,
      customerName,
      isCredit,
      fiadoCode,
      status: paymentType === 'FIADO' ? 'PENDING' : 'COMPLETED',
    })

    // Criar venda
    const sale = await prisma.sale.create({
      data: {
        quantity,
        totalPrice,
        paymentType,
        notes,
        userId: session.user.id,
        productId,
        customerId,
        fiadoCode,
        status: paymentType === 'FIADO' ? 'PENDING' : 'COMPLETED',
      },
      include: {
        user: { select: { name: true } },
        product: { select: { name: true } },
        customer: { select: { name: true } },
      },
    })

    // Atualizar estoque apenas se não for fiado
    if (paymentType !== 'FIADO') {
      await prisma.product.update({
        where: { id: productId },
        data: { stock: product.stock - quantity }
      })

      // Registrar movimentação de estoque
      await prisma.inventory.create({
        data: {
          quantity: -quantity,
          type: 'SAIDA',
          notes: `Venda para ${customerName || 'consumidor final'}`,
          productId,
        },
      })
    }

    return NextResponse.json(sale, { status: 201 })
  } catch (error) {
    console.error('Error creating sale:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
