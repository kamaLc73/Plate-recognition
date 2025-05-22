"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiCall } from "@/lib/api-utils"

interface LoginFormProps {
  onResult: (data: any) => void
}

export default function LoginForm({ onResult }: LoginFormProps) {
  const [formData, setFormData] = useState({
    matricule: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const queryParams = new URLSearchParams(formData as any).toString()
    const result = await apiCall(`/login?${queryParams}`, "POST")
    onResult(result)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="matricule">Matricule:</Label>
        <Input
          id="matricule"
          name="matricule"
          type="number"
          value={formData.matricule}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de Passe:</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Connexion
      </Button>
    </form>
  )
}
