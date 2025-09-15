import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar se é admin
    if (session.user.role !== 'ADMINISTRATIVO') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const vehicleId = params.id
    const body = await request.json()
    const { userId } = body

    // Verificar se o veículo existe
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Se userId for fornecido, verificar se o usuário existe
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Verificar se o usuário já tem um veículo atribuído
      const existingVehicle = await prisma.vehicle.findFirst({
        where: { 
          userId: userId,
          id: { not: vehicleId }
        }
      })

      if (existingVehicle) {
        return NextResponse.json({ 
          error: 'User already has a vehicle assigned. Please unassign the current vehicle first.' 
        }, { status: 400 })
      }
    }

    // Atualizar o veículo
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { userId: userId || null },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error('Error assigning vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar se é admin
    if (session.user.role !== 'ADMINISTRATIVO') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const vehicleId = params.id

    // Verificar se o veículo existe
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Remover atribuição do veículo
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { userId: null },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error('Error unassigning vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
