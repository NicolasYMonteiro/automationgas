'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Car, User, X } from 'lucide-react'

interface Vehicle {
  id: string
  name: string
  plate: string
  model?: string
  user?: {
    id: string
    name: string
    email: string
  }
}

interface Employee {
  id: string
  name: string
  email: string
  role: string
}

interface VehicleAssignmentProps {
  vehicle: Vehicle
  onUpdate: () => void
}

export function VehicleAssignment({ vehicle, onUpdate }: VehicleAssignmentProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const handleAssign = async () => {
    if (!selectedEmployeeId) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/vehicles/${vehicle.id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: selectedEmployeeId }),
      })

      if (response.ok) {
        onUpdate()
        setIsDialogOpen(false)
        setSelectedEmployeeId('')
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao atribuir veículo')
      }
    } catch (error) {
      console.error('Error assigning vehicle:', error)
      alert('Erro ao atribuir veículo')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnassign = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/vehicles/${vehicle.id}/assign`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onUpdate()
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao desatribuir veículo')
      }
    } catch (error) {
      console.error('Error unassigning vehicle:', error)
      alert('Erro ao desatribuir veículo')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {vehicle.user ? (
        <div className="flex items-center space-x-2">
          <Badge className="bg-blue-100 text-blue-800">
            <User className="w-3 h-3 mr-1" />
            {vehicle.user.name}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUnassign}
            disabled={isLoading}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Car className="w-3 h-3 mr-1" />
              Atribuir
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Atribuir Veículo</DialogTitle>
              <DialogDescription>
                Selecione um funcionário para atribuir o veículo {vehicle.name} ({vehicle.plate})
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um funcionário" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} ({employee.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAssign} disabled={!selectedEmployeeId || isLoading}>
                {isLoading ? 'Atribuindo...' : 'Atribuir'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
