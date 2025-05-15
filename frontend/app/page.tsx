"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUp, FileText, LogOut } from "lucide-react"

export default function HomePage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">P2P Belge Paylaşım Sistemi</h1>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Çıkış Yap</span>
            </Button>
          </header>

          <div className="mb-8">
            <h2 className="text-xl font-medium text-gray-800">
              Hoş geldiniz, <span className="text-teal-600">{user?.name}</span>
            </h2>
            <p className="text-gray-600 mt-1">
              Belge paylaşım sisteminde belge yükleyebilir ve mevcut belgeleri görüntüleyebilirsiniz.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Belge Yükle</CardTitle>
                <CardDescription>Sisteme yeni bir belge yükleyin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-32 bg-gray-100 rounded-md">
                  <FileUp className="h-12 w-12 text-teal-500" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => router.push("/upload")}>
                  Belge Yükleme Sayfasına Git
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Belgeleri Görüntüle</CardTitle>
                <CardDescription>Yüklenen belgeleri görüntüleyin ve yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-32 bg-gray-100 rounded-md">
                  <FileText className="h-12 w-12 text-teal-500" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => router.push("/list")}>
                  Belge Listesine Git
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
