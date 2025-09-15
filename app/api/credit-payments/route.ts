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

    const payments = await prisma.creditPayment.findMany({
      include: {
        customer: { select: { name: true, code: true } }
      },
      orderBy: { paymentDate: 'desc' },
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching credit payments:', error)
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
    const { customerId, amount, notes } = body

    // Verificar se o cliente existe
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const payment = await prisma.creditPayment.create({
      data: {
        amount: parseFloat(amount),
        notes,
        customerId,
      },
      include: {
        customer: { select: { name: true, code: true } }
      },
    })

    // O pagamento é apenas registrado, não altera o status das vendas
    // O débito será calculado como: total vendas fiadas - total pagamentos
    console.log(`Payment registered: ${parseFloat(amount)} for customer ${customer.name}`)

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Error creating credit payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
