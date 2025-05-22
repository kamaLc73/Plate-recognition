"use client"

import { Button } from "@/components/ui/button"
import { apiCall } from "@/lib/api-utils"
import { Database } from "lucide-react"

interface GetPlatesButtonProps {
  onResult: (data: any) => void
}

export default function GetPlatesButton({ onResult }: GetPlatesButtonProps) {
  const handleClick = async () => {
    const result = await apiCall("/get_plates", "GET")
    onResult(result)
  }

  return (
    <Button onClick={handleClick} className="flex items-center gap-2">
      <Database size={16} />
      <span>Obtenir Toutes les Plaques</span>
    </Button>
  )
}
