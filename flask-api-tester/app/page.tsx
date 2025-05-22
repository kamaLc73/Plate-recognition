"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AddUserForm from "@/components/add-user-form"
import AddPlateForm from "@/components/add-plate-form"
import DeleteUserForm from "@/components/delete-user-form"
import DeletePlateForm from "@/components/delete-plate-form"
import GetPlateForm from "@/components/get-plate-form"
import UpdateUserForm from "@/components/update-user-form"
import LoginForm from "@/components/login-form"
import GetUsersButton from "@/components/get-users-button"
import GetPlatesButton from "@/components/get-plates-button"
import UploadImageForm from "@/components/upload-image-form"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Home() {
  const [result, setResult] = useState<any>(null)

  const handleResult = (data: any) => {
    setResult(data)
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Interface de Test API Flask</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="add-user" className="w-full">
            <div className="mb-4">
              <div className="text-sm text-muted-foreground mb-2">Gestion des utilisateurs</div>
              <TabsList className="mb-2 w-full">
                <TabsTrigger value="add-user" className="flex-1">
                  Ajouter
                </TabsTrigger>
                <TabsTrigger value="update-user" className="flex-1">
                  Mettre à jour
                </TabsTrigger>
                <TabsTrigger value="delete-user" className="flex-1">
                  Supprimer
                </TabsTrigger>
                <TabsTrigger value="login" className="flex-1">
                  Connexion
                </TabsTrigger>
              </TabsList>

              <div className="text-sm text-muted-foreground mb-2 mt-4">Consultation des données</div>
              <TabsList className="mb-2 w-full">
                <TabsTrigger value="get-data" className="flex-1">
                  Consulter
                </TabsTrigger>
              </TabsList>

              <div className="text-sm text-muted-foreground mb-2 mt-4">Gestion des plaques</div>
              <TabsList className="mb-2 w-full">
                <TabsTrigger value="add-plate" className="flex-1">
                  Ajouter
                </TabsTrigger>
                <TabsTrigger value="delete-plate" className="flex-1">
                  Supprimer
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex-1">
                  Télécharger Image
                </TabsTrigger>
              </TabsList>
            </div>

            <Card>
              <CardContent className="pt-6">
                <TabsContent value="add-user">
                  <AddUserForm onResult={handleResult} />
                </TabsContent>

                <TabsContent value="add-plate">
                  <AddPlateForm onResult={handleResult} />
                </TabsContent>

                <TabsContent value="delete-user">
                  <DeleteUserForm onResult={handleResult} />
                </TabsContent>

                <TabsContent value="delete-plate">
                  <DeletePlateForm onResult={handleResult} />
                </TabsContent>

                <TabsContent value="get-data">
                  <div className="space-y-6">
                    <GetPlateForm onResult={handleResult} />
                    <div className="flex flex-wrap gap-4 mt-4">
                      <GetUsersButton onResult={handleResult} />
                      <GetPlatesButton onResult={handleResult} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="update-user">
                  <UpdateUserForm onResult={handleResult} />
                </TabsContent>

                <TabsContent value="login">
                  <LoginForm onResult={handleResult} />
                </TabsContent>

                <TabsContent value="upload">
                  <UploadImageForm onResult={handleResult} />
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Résultat</CardTitle>
              <CardDescription>Réponse de l'API</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] rounded-md border p-4">
                <div className="space-y-2">
                  {result ? (
                    <>
                      {result.error ? (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-800">
                          <h4 className="font-medium mb-1">Erreur détectée :</h4>
                          <p className="text-sm mb-2">{result.error}</p>

                          {result.details && (
                            <div className="text-xs bg-red-100 p-2 rounded">
                              <p className="font-medium">Détails techniques :</p>
                              <p>{result.details}</p>
                            </div>
                          )}

                          <div className="mt-3 text-xs">
                            <p className="font-medium">Origine probable :</p>
                            {result.status ? (
                              <p>API Flask (erreur de traitement côté serveur)</p>
                            ) : result.details && result.details.includes("fetch") ? (
                              <p>Problème de connexion à l'API (vérifiez que l'API est en cours d'exécution)</p>
                            ) : result.details && result.details.includes("CORS") ? (
                              <p>Problème CORS (vérifiez la configuration CORS de votre API)</p>
                            ) : (
                              <p>Indéterminée (voir les détails pour plus d'informations)</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <pre className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded-md border">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-gray-500 py-10">Aucun résultat</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
