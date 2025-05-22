"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiCall } from "@/lib/api-utils"

interface AddUserFormProps {
  onResult: (data: any) => void
}

export default function AddUserForm({ onResult }: AddUserFormProps) {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    matricule: "",
    role: "admin",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await apiCall("/add_user", "POST", formData)
    onResult(result)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom:</Label>
          <Input id="nom" name="nom" value={formData.nom} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email:</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password:</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="matricule">Matricule:</Label>
          <Input id="matricule" name="matricule" value={formData.matricule} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role:</Label>
          <Select value={formData.role} onValueChange={handleRoleChange}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">admin</SelectItem>
              <SelectItem value="securite">securite</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Ajouter Utilisateur
      </Button>
    </form>
  )
}
