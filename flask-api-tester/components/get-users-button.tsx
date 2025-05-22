"use client"

import { Button } from "@/components/ui/button"
import { apiCall } from "@/lib/api-utils"
import { Users } from "lucide-react"

interface GetUsersButtonProps {
  onResult: (data: any) => void
}

export default function GetUsersButton({ onResult }: GetUsersButtonProps) {
  const handleClick = async () => {
    const result = await apiCall("/get_users", "GET")
    onResult(result)
  }

  return (
    <Button onClick={handleClick} className="flex items-center gap-2">
      <Users size={16} />
      <span>Obtenir Tous les Utilisateurs</span>
    </Button>
  )
}
