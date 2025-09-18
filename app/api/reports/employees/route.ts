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

    // Verificar se é admin
    if (session.user.role !== 'ADMINISTRATIVO') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const employeeId = searchParams.get('employeeId')

    // Construir filtros de data
    const dateFilter: any = {}
    if (startDate) {
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0) // Início do dia
      dateFilter.gte = start
    }
    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999) // Final do dia
      dateFilter.lte = end
    }

    // Buscar funcionários
    const employees = await prisma.user.findMany({
      where: employeeId ? { id: employeeId } : {},
      include: {
        sales: {
          where: {
            ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
          },
          include: {
            product: { select: { name: true } },
            customer: { select: { name: true } }
          }
        },
        expenses: {
          where: {
            ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
          },
          include: {
            vehicle: { select: { name: true, plate: true } }
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Calcular estatísticas para cada funcionário
    const employeeReports = employees.map(employee => {
      const totalSales = employee.sales
        .filter(sale => sale.status === 'COMPLETED')
        .reduce((sum, sale) => sum + Number(sale.totalPrice), 0)

      const totalExpenses = employee.expenses
        .reduce((sum, expense) => sum + Number(expense.amount), 0)

      const salesCount = employee.sales.filter(sale => sale.status === 'COMPLETED').length
      const expensesCount = employee.expenses.length

      const netResult = totalSales - totalExpenses

      return {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        totalSales,
        totalExpenses,
        netResult,
        salesCount,
        expensesCount,
        sales: employee.sales.map(sale => ({
          id: sale.id,
          product: sale.product.name,
          customer: sale.customer?.name || 'Consumidor Final',
          quantity: sale.quantity,
          totalPrice: Number(sale.totalPrice),
          paymentType: sale.paymentType,
          status: sale.status,
          date: sale.createdAt
        })),
        expenses: employee.expenses.map(expense => ({
          id: expense.id,
          description: expense.description,
          amount: Number(expense.amount),
          category: expense.category,
          vehicle: expense.vehicle ? `${expense.vehicle.name} - ${expense.vehicle.plate}` : 'Sem veículo',
          date: expense.createdAt
        }))
      }
    })

    // Calcular totais gerais
    const totalSalesAll = employeeReports.reduce((sum, emp) => sum + emp.totalSales, 0)
    const totalExpensesAll = employeeReports.reduce((sum, emp) => sum + emp.totalExpenses, 0)
    const totalNetResult = totalSalesAll - totalExpensesAll

    return NextResponse.json({
      period: {
        startDate,
        endDate
      },
      summary: {
        totalEmployees: employees.length,
        totalSales: totalSalesAll,
        totalExpenses: totalExpensesAll,
        totalNetResult
      },
      employees: employeeReports
    })
  } catch (error) {
    console.error('Error generating employee report:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
