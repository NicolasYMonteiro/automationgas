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
    const { productId, customerName, quantity, paymentType, notes, isCredit } = body

    // Buscar produto para obter o preço
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

    const totalPrice = Number(product.price) * quantity

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
