"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiCall } from "@/lib/api-utils"

interface DeletePlateFormProps {
  onResult: (data: any) => void
}

export default function DeletePlateForm({ onResult }: DeletePlateFormProps) {
  const [id, setId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await apiCall("/delete_plate", "DELETE", { id })
    onResult(result)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="id">ID Plaque:</Label>
        <Input id="id" name="id" value={id} onChange={(e) => setId(e.target.value)} required />
      </div>

      <Button type="submit" variant="destructive" className="w-full">
        Supprimer Plaque
      </Button>
    </form>
  )
}
