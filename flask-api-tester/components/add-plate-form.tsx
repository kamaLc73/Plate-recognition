"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiCall } from "@/lib/api-utils"

interface AddPlateFormProps {
  onResult: (data: any) => void
}

export default function AddPlateForm({ onResult }: AddPlateFormProps) {
  const [formData, setFormData] = useState({
    entite_emetrice: "",
    site_objet: "",
    personne_autorise: "",
    nom_prestataire: "",
    cin_prestat: "",
    date_arrivée: "",
    date_depart: "",
    objet_visite: "",
    agent_bam_accuelle: "",
    num_vehicule1: "",
    num_vehicule2: "أ",
    num_vehicule3: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, num_vehicule2: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await apiCall("/add_plate", "POST", formData)
    onResult(result)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entite_emetrice">Entité Émettrice:</Label>
          <Input
            id="entite_emetrice"
            name="entite_emetrice"
            value={formData.entite_emetrice}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="site_objet">Site Objet:</Label>
          <Input id="site_objet" name="site_objet" value={formData.site_objet} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="personne_autorise">Personne Autorisée:</Label>
          <Input
            id="personne_autorise"
            name="personne_autorise"
            value={formData.personne_autorise}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nom_prestataire">Nom Prestataire:</Label>
          <Input
            id="nom_prestataire"
            name="nom_prestataire"
            value={formData.nom_prestataire}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cin_prestat">CIN Prestataire:</Label>
          <Input id="cin_prestat" name="cin_prestat" value={formData.cin_prestat} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_arrivée">Date Arrivée:</Label>
          <Input id="date_arrivée" name="date_arrivée" value={formData.date_arrivée} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_depart">Date Départ:</Label>
          <Input id="date_depart" name="date_depart" value={formData.date_depart} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="objet_visite">Objet Visite:</Label>
          <Input id="objet_visite" name="objet_visite" value={formData.objet_visite} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="agent_bam_accuelle">Agent BAM Accueillé:</Label>
          <Input
            id="agent_bam_accuelle"
            name="agent_bam_accuelle"
            value={formData.agent_bam_accuelle}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="border p-4 rounded-md">
        <h3 className="font-medium mb-4">Numéro de Véhicule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="num_vehicule1">Partie 1:</Label>
            <Input
              id="num_vehicule1"
              name="num_vehicule1"
              type="number"
              value={formData.num_vehicule1}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="num_vehicule2">Partie 2:</Label>
            <Select value={formData.num_vehicule2} onValueChange={handleSelectChange}>
              <SelectTrigger id="num_vehicule2">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="أ">أ</SelectItem>
                <SelectItem value="ب">ب</SelectItem>
                <SelectItem value="و">و</SelectItem>
                <SelectItem value="د">د</SelectItem>
                <SelectItem value="ه">ه</SelectItem>
                <SelectItem value="ش">ش</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="num_vehicule3">Partie 3:</Label>
            <Input
              id="num_vehicule3"
              name="num_vehicule3"
              type="number"
              value={formData.num_vehicule3}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Ajouter Plaque
      </Button>
    </form>
  )
}
