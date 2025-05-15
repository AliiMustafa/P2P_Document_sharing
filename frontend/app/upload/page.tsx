"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowLeft, FileUp, Upload } from "lucide-react"
import axios from "@/lib/axios"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Lütfen bir dosya seçin")
      return
    }

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast({
        title: "Başarılı",
        description: "Belge başarıyla yüklendi",
      })

      // Dosya yüklendikten sonra formu sıfırla
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      setError("Belge yüklenirken bir hata oluştu. Lütfen tekrar deneyin.")
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Belge yüklenirken bir hata oluştu",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" className="mb-4" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Ana Sayfaya Dön
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Belge Yükle</CardTitle>
              <CardDescription>
                Sisteme yeni bir belge yüklemek için dosya seçin ve yükle butonuna tıklayın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Dosya seçmek için tıklayın veya dosyayı buraya sürükleyin</p>
                <p className="mt-1 text-xs text-gray-500">PDF, DOCX, XLSX, PPTX, TXT (max. 10MB)</p>
              </div>

              {file && (
                <div className="bg-gray-100 p-3 rounded-md flex items-center justify-between">
                  <div className="truncate">
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFile(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    }}
                  >
                    Kaldır
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleUpload} disabled={!file || uploading}>
                {uploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 border-2 border-t-teal-500 border-teal-200 rounded-full animate-spin"></div>
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Yükle
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
