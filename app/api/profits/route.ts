import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'monthly'
    const year = searchParams.get('year') || new Date().getFullYear().toString()

    // Buscar vendas e despesas baseado no período
    const now = new Date()
    let startDate: Date
    let endDate: Date = now

    switch (period) {
      case 'daily':
        startDate = new Date(now)
        startDate.setDate(startDate.getDate() - 30) // Últimos 30 dias
        break
      case 'weekly':
        startDate = new Date(now)
        startDate.setDate(startDate.getDate() - 84) // Últimas 12 semanas
        break
      case 'monthly':
        startDate = new Date(parseInt(year), 0, 1) // Primeiro dia do ano
        endDate = new Date(parseInt(year), 11, 31) // Último dia do ano
        break
      case 'yearly':
        startDate = new Date(parseInt(year) - 4, 0, 1) // Últimos 5 anos
        break
      default:
        startDate = new Date(parseInt(year), 0, 1)
        endDate = new Date(parseInt(year), 11, 31)
    }

    // Construir filtros de data
    const dateFilter: any = {}
    if (startDate) {
      dateFilter.gte = startDate
    }
    if (endDate) {
      dateFilter.lte = endDate
    }

    // Buscar vendas
    const salesWhere: any = { status: 'COMPLETED' }
    if (Object.keys(dateFilter).length > 0) {
      salesWhere.createdAt = dateFilter
    }

    const sales = await prisma.sale.findMany({
      where: salesWhere,
      include: {
        product: {
          select: { name: true }
        },
        customer: {
          select: { name: true }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Buscar despesas
    const expensesWhere: any = {}
    if (Object.keys(dateFilter).length > 0) {
      expensesWhere.createdAt = dateFilter
    }

    const expenses = await prisma.expense.findMany({
      where: expensesWhere,
      include: {
        vehicle: {
          select: { name: true, plate: true }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    console.log(`Found ${sales.length} sales and ${expenses.length} expenses for period ${period}, year ${year}`)

    // Processar dados baseado no período
    let processedData: any[] = []

    if (period === 'daily') {
      // Agrupar por dia
      const dailyMap = new Map()
      
      sales.forEach(sale => {
        const date = sale.createdAt.toISOString().split('T')[0]
        if (!dailyMap.has(date)) {
          dailyMap.set(date, { period: date, sales: 0, expenses: 0, profit: 0 })
        }
        dailyMap.get(date).sales += Number(sale.totalPrice)
      })

      expenses.forEach(expense => {
        const date = expense.createdAt.toISOString().split('T')[0]
        if (!dailyMap.has(date)) {
          dailyMap.set(date, { period: date, sales: 0, expenses: 0, profit: 0 })
        }
        dailyMap.get(date).expenses += Number(expense.amount)
      })

      processedData = Array.from(dailyMap.values()).map(item => ({
        period: new Date(item.period).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        sales: item.sales,
        expenses: item.expenses,
        profit: item.sales - item.expenses
      }))
    } else if (period === 'weekly') {
      // Agrupar por semana
      const weeklyMap = new Map()
      
      sales.forEach(sale => {
        const weekStart = new Date(sale.createdAt)
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        const weekKey = weekStart.toISOString().split('T')[0]
        
        if (!weeklyMap.has(weekKey)) {
          weeklyMap.set(weekKey, { period: weekKey, sales: 0, expenses: 0, profit: 0 })
        }
        weeklyMap.get(weekKey).sales += Number(sale.totalPrice)
      })

      expenses.forEach(expense => {
        const weekStart = new Date(expense.createdAt)
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        const weekKey = weekStart.toISOString().split('T')[0]
        
        if (!weeklyMap.has(weekKey)) {
          weeklyMap.set(weekKey, { period: weekKey, sales: 0, expenses: 0, profit: 0 })
        }
        weeklyMap.get(weekKey).expenses += Number(expense.amount)
      })

      let weekCount = 1
      processedData = Array.from(weeklyMap.values()).map(item => ({
        period: `Sem ${weekCount++}`,
        sales: item.sales,
        expenses: item.expenses,
        profit: item.sales - item.expenses
      }))
    } else if (period === 'monthly') {
      // Agrupar por mês
      const monthlyMap = new Map()
      
      sales.forEach(sale => {
        const monthKey = `${sale.createdAt.getFullYear()}-${String(sale.createdAt.getMonth() + 1).padStart(2, '0')}`
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, { period: monthKey, sales: 0, expenses: 0, profit: 0 })
        }
        monthlyMap.get(monthKey).sales += Number(sale.totalPrice)
      })

      expenses.forEach(expense => {
        const monthKey = `${expense.createdAt.getFullYear()}-${String(expense.createdAt.getMonth() + 1).padStart(2, '0')}`
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, { period: monthKey, sales: 0, expenses: 0, profit: 0 })
        }
        monthlyMap.get(monthKey).expenses += Number(expense.amount)
      })

      processedData = Array.from(monthlyMap.values()).map(item => {
        const [year, month] = item.period.split('-')
        const date = new Date(parseInt(year), parseInt(month) - 1, 1)
        const profit = item.sales - item.expenses
        const margin = item.sales > 0 ? (profit / item.sales) * 100 : 0
        
        return {
          period: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
          sales: item.sales,
          expenses: item.expenses,
          profit,
          margin: Math.round(margin * 10) / 10
        }
      })
    } else if (period === 'yearly') {
      // Agrupar por ano
      const yearlyMap = new Map()
      
      sales.forEach(sale => {
        const year = sale.createdAt.getFullYear().toString()
        if (!yearlyMap.has(year)) {
          yearlyMap.set(year, { period: year, sales: 0, expenses: 0, profit: 0 })
        }
        yearlyMap.get(year).sales += Number(sale.totalPrice)
      })

      expenses.forEach(expense => {
        const year = expense.createdAt.getFullYear().toString()
        if (!yearlyMap.has(year)) {
          yearlyMap.set(year, { period: year, sales: 0, expenses: 0, profit: 0 })
        }
        yearlyMap.get(year).expenses += Number(expense.amount)
      })

      processedData = Array.from(yearlyMap.values()).map(item => ({
        period: item.period,
        sales: item.sales,
        expenses: item.expenses,
        profit: item.sales - item.expenses
      }))
    }

    // Ordenar dados por período
    processedData.sort((a, b) => {
      if (period === 'daily') {
        return new Date(a.period.split('/').reverse().join('-')).getTime() - new Date(b.period.split('/').reverse().join('-')).getTime()
      }
      return a.period.localeCompare(b.period)
    })

    // Calcular totais
    const totalSales = processedData.reduce((sum, item) => sum + item.sales, 0)
    const totalExpenses = processedData.reduce((sum, item) => sum + item.expenses, 0)
    const totalProfit = totalSales - totalExpenses
    const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0

    // Encontrar melhor e pior período
    let bestPeriod = null
    let worstPeriod = null
    
    if (processedData.length > 0) {
      bestPeriod = processedData.reduce((best, current) => 
        current.profit > best.profit ? current : best
      )
      worstPeriod = processedData.reduce((worst, current) => 
        current.profit < worst.profit ? current : worst
      )
    }

    return NextResponse.json({
      period,
      year,
      data: processedData,
      summary: {
        totalSales,
        totalExpenses,
        totalProfit,
        profitMargin: Math.round(profitMargin * 10) / 10,
        bestPeriod,
        worstPeriod
      }
    })

  } catch (error) {
    console.error('Error fetching profits data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
