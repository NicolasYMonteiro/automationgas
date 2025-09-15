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
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.isActive = status === 'active'
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { plate: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ]
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        expenses: {
          select: { amount: true }
        }
      },
      orderBy: { name: 'asc' },
    })

    // Calcular total de despesas
    const vehiclesWithExpenses = vehicles.map(vehicle => ({
      ...vehicle,
      totalExpenses: vehicle.expenses.reduce((sum, expense) => sum + expense.amount.toNumber(), 0)
    }))

    return NextResponse.json(vehiclesWithExpenses)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar se é admin
    if (session.user.role !== 'ADMINISTRATIVO') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, plate, model, year, userId } = body

    // Verificar se a placa já existe
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { plate }
    })

    if (existingVehicle) {
      return NextResponse.json({ error: 'Vehicle plate already exists' }, { status: 400 })
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        plate,
        model,
        year: year ? parseInt(year) : null,
        userId: userId || null,
        isActive: true,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
