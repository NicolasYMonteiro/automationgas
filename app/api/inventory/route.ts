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
    const type = searchParams.get('type')
    const productId = searchParams.get('productId')

    const where: any = {}
    
    if (type && type !== 'all') {
      where.type = type
    }

    if (productId) {
      where.productId = productId
    }

    const movements = await prisma.inventory.findMany({
      where,
      include: {
        product: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(movements)
  } catch (error) {
    console.error('Error fetching inventory movements:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, quantity, type, notes } = body

    // Verificar se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Criar movimentação
    const movement = await prisma.inventory.create({
      data: {
        quantity: parseInt(quantity),
        type,
        notes,
        productId,
      },
      include: {
        product: { select: { name: true } }
      },
    })

    // Atualizar estoque do produto
    const newStock = type === 'ENTRADA' 
      ? product.stock + parseInt(quantity)
      : product.stock - parseInt(quantity)

    await prisma.product.update({
      where: { id: productId },
      data: { stock: Math.max(0, newStock) }
    })

    return NextResponse.json(movement, { status: 201 })
  } catch (error) {
    console.error('Error creating inventory movement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
