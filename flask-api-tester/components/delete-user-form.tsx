"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiCall } from "@/lib/api-utils"

interface DeleteUserFormProps {
  onResult: (data: any) => void
}

export default function DeleteUserForm({ onResult }: DeleteUserFormProps) {
  const [id, setId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await apiCall("/delete_user", "DELETE", { id })
    onResult(result)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="id">ID Utilisateur:</Label>
        <Input id="id" name="id" value={id} onChange={(e) => setId(e.target.value)} required />
      </div>

      <Button type="submit" variant="destructive" className="w-full">
        Supprimer Utilisateur
      </Button>
    </form>
  )
}
