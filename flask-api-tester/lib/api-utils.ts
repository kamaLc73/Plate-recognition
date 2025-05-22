// Utiliser la variable d'environnement avec une valeur par défaut
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function apiCall(endpoint: string, method: string, data?: Record<string, any>) {
  try {
    // Construire l'URL complète en combinant l'URL de base et le endpoint
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`

    const options: RequestInit = {
      method,
      headers: {},
    }

    // Add body for non-GET requests
    if (method !== "GET" && data) {
      if (method === "POST" || method === "PUT" || method === "DELETE") {
        options.headers = {
          "Content-Type": "application/x-www-form-urlencoded",
        }
        options.body = new URLSearchParams(data as Record<string, string>).toString()
      }
    }

    const response = await fetch(url, options)
    return await response.json()
  } catch (error) {
    console.error("API call error:", error)
    return { error: "Une erreur s'est produite lors de l'appel à l'API" }
  }
}

export const getApiBaseUrl = () => {
  return localStorage.getItem("api_base_url") || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
}

export const setApiBaseUrl = (url: string) => {
  localStorage.setItem("api_base_url", url)
}
