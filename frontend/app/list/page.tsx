"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Download, FileText, Trash2 } from "lucide-react"
import axios from "@/lib/axios"
import { formatDate } from "@/lib/utils"

type Document = {
  id: string
  name: string
  createdAt: string
  size: number
}

export default function ListPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/documents")
      setDocuments(response.data.documents)
      setError(null)
    } catch (err) {
      setError("Belgeler yüklenirken bir hata oluştu")
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Belgeler yüklenirken bir hata oluştu",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (id: string, name: string) => {
    try {
      const response = await axios.get(`/api/download/${id}`, {
        responseType: "blob",
      })

      // Dosyayı indirme işlemi
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", name)
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast({
        title: "Başarılı",
        description: "Belge indirme işlemi başlatıldı",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Belge indirilirken bir hata oluştu",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu belgeyi silmek istediğinizden emin misiniz?")) {
      return
    }

    try {
      await axios.delete(`/api/delete/${id}`)

      // Belgeyi listeden kaldır
      setDocuments((prev) => prev.filter((doc) => doc.id !== id))

      toast({
        title: "Başarılı",
        description: "Belge başarıyla silindi",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Belge silinirken bir hata oluştu",
      })
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-5xl mx-auto">
          <Button variant="ghost" className="mb-4" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Ana Sayfaya Dön
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Yüklenen Belgeler</CardTitle>
              <CardDescription>Sisteme yüklediğiniz tüm belgeleri görüntüleyin, indirin veya silin</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-t-teal-500 border-teal-200 rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Henüz belge yok</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Sisteme henüz belge yüklemediniz. Belge yüklemek için ana sayfaya dönün.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => router.push("/upload")}>Belge Yükle</Button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Belge Adı</TableHead>
                        <TableHead>Yükleme Tarihi</TableHead>
                        <TableHead>Boyut</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.name}</TableCell>
                          <TableCell>{formatDate(doc.createdAt)}</TableCell>
                          <TableCell>{(doc.size / 1024 / 1024).toFixed(2)} MB</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="icon" onClick={() => handleDownload(doc.id, doc.name)}>
                                <Download className="h-4 w-4" />
                                <span className="sr-only">İndir</span>
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => handleDelete(doc.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Sil</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
