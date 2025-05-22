"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UploadImageFormProps {
  onResult: (data: any) => void
}

export default function UploadImageForm({ onResult }: UploadImageFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setError(null)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      // Créer un FormData pour l'upload de fichier
      const formData = new FormData()
      formData.append("file", file)

      // Utiliser l'URL complète de l'API Flask
      const apiUrl = "http://localhost:5000/upload" // Remplacez par votre URL d'API si nécessaire

      console.log("Envoi de la requête à:", apiUrl)

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        // Ne pas définir Content-Type pour FormData, le navigateur le fait automatiquement
      })

      console.log("Statut de la réponse:", response.status)

      // Vérifier si la réponse est OK
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      // Essayer de parser la réponse JSON
      let result
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        result = await response.json()
        console.log("Réponse JSON reçue:", result)
      } else {
        // Si ce n'est pas du JSON, obtenir le texte
        const text = await response.text()
        console.log("Réponse texte reçue:", text)
        result = { message: text }
      }

      // Envoyer le résultat au composant parent
      onResult(result)
    } catch (error) {
      console.error("Erreur d'upload:", error)
      setError(error instanceof Error ? error.message : "Une erreur s'est produite")

      // Envoyer l'erreur au composant parent
      onResult({
        error: "Une erreur s'est produite lors du téléchargement",
        details: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">Sélectionner une image:</Label>
        <Input id="file" name="file" type="file" accept="image/*" onChange={handleFileChange} required />
      </div>

      {preview && (
        <div className="mt-4 border rounded-md p-2">
          <p className="text-sm text-gray-500 mb-2">Aperçu:</p>
          <img
            src={preview || "/placeholder.svg"}
            alt="Aperçu"
            className="max-h-48 max-w-full object-contain mx-auto"
          />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={!file || isUploading} className="w-full flex items-center gap-2">
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Téléchargement en cours...</span>
          </>
        ) : (
          <>
            <Upload size={16} />
            <span>Télécharger l'image</span>
          </>
        )}
      </Button>

      <div className="text-xs text-gray-500 mt-2">
        <p>Note: Si vous ne recevez pas de réponse après l'upload, vérifiez les points suivants:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>L'API Flask est en cours d'exécution sur http://localhost:5000</li>
          <li>CORS est correctement configuré dans votre API Flask</li>
          <li>La console du navigateur pour voir les erreurs potentielles</li>
        </ul>
      </div>
    </form>
  )
}
