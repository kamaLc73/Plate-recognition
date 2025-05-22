"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiCall } from "@/lib/api-utils"

interface GetPlateFormProps {
  onResult: (data: any) => void
}

export default function GetPlateForm({ onResult }: GetPlateFormProps) {
  const [matricule, setMatricule] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await apiCall(`/get_plate?matricule=${encodeURIComponent(matricule)}`, "GET")
    onResult(result)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="matricule">Matricule:</Label>
        <Input
          id="matricule"
          name="matricule"
          value={matricule}
          onChange={(e) => setMatricule(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Obtenir Plaque
      </Button>
    </form>
  )
}
