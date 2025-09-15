import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Testar vendas
    const salesCount = await prisma.sale.count()
    const sales = await prisma.sale.findMany({
      take: 3,
      include: {
        user: { select: { name: true } },
        product: { select: { name: true } },
        customer: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' }
    })

    // Testar despesas
    const expensesCount = await prisma.expense.count()
    const expenses = await prisma.expense.findMany({
      take: 3,
      include: {
        user: { select: { name: true } },
        vehicle: { select: { name: true, plate: true } },
      },
      orderBy: { createdAt: 'desc' }
    })

    // Testar produtos
    const productsCount = await prisma.product.count()
    const products = await prisma.product.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' }
    })

    // Testar clientes
    const customersCount = await prisma.customer.count()
    const customers = await prisma.customer.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: {
        sales: {
          count: salesCount,
          sample: sales
        },
        expenses: {
          count: expensesCount,
          sample: expenses
        },
        products: {
          count: productsCount,
          sample: products
        },
        customers: {
          count: customersCount,
          sample: customers
        }
      }
    })
  } catch (error) {
    console.error('Error testing data:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
