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
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        user: { select: { name: true } },
        vehicle: { select: { name: true, plate: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Error fetching expenses:', error)
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
    const { description, amount, category, vehicleId, notes } = body

    const expense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        category,
        notes,
        userId: session.user.id,
        vehicleId: vehicleId || null,
      },
      include: {
        user: { select: { name: true } },
        vehicle: { select: { name: true, plate: true } },
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
