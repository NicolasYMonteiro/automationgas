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
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ]
    }

    const customers = await prisma.customer.findMany({
      where,
      include: {
        sales: {
          select: { totalPrice: true, paymentType: true, status: true }
        },
        creditPayments: {
          orderBy: { paymentDate: 'desc' },
          select: { paymentDate: true, amount: true }
        }
      },
      orderBy: { name: 'asc' },
    })

    // Calcular débitos e status
    const customersWithDebt = customers.map(customer => {
      // Calcular débito: total vendas fiadas - total pagamentos
      const totalFiadoSales = customer.sales
        .filter(sale => sale.paymentType === 'FIADO')
        .reduce((sum, sale) => sum + Number(sale.totalPrice), 0)
      
      const totalPayments = customer.creditPayments
        .reduce((sum, payment) => sum + Number(payment.amount), 0)
      
      const totalDebt = totalFiadoSales - totalPayments
      const lastPayment = customer.creditPayments.length > 0 ? customer.creditPayments[0]?.paymentDate : null
      
      // Debug log
      console.log(`Cliente ${customer.name}:`)
      console.log(`  Total vendas fiadas: R$ ${totalFiadoSales}`)
      console.log(`  Total pagamentos: R$ ${totalPayments}`)
      console.log(`  Débito atual: R$ ${totalDebt}`)
      
      return {
        ...customer,
        totalDebt,
        lastPayment,
        status: totalDebt > 0 ? 'ATIVO' : 'ATIVO' // Pode ser expandido para incluir bloqueio
      }
    })

    // Filtrar por status se especificado
    const filteredCustomers = status && status !== 'all' 
      ? customersWithDebt.filter(c => c.status === status)
      : customersWithDebt

    return NextResponse.json(filteredCustomers)
  } catch (error) {
    console.error('Error fetching customers:', error)
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
    const { name, code, phone, address, creditLimit } = body

    // Gerar código automático se não fornecido
    let customerCode = code
    if (!customerCode || customerCode.trim() === '') {
      customerCode = `CLI-${Date.now()}`
    }

    // Verificar se o código já existe
    const existingCustomer = await prisma.customer.findUnique({
      where: { code: customerCode }
    })

    if (existingCustomer) {
      return NextResponse.json({ error: 'Customer code already exists' }, { status: 400 })
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        code: customerCode,
        phone,
        address,
        creditLimit: creditLimit ? parseFloat(creditLimit) : null,
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, phone, address, creditLimit } = body

    // Verificar se o cliente existe
    const existingCustomer = await prisma.customer.findUnique({
      where: { id }
    })

    if (!existingCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        phone,
        address,
        creditLimit: creditLimit ? parseFloat(creditLimit) : null,
      },
    })

    return NextResponse.json(customer, { status: 200 })
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
