"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/axios"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean }>
  logout: () => void
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Sayfa yüklendiğinde token kontrolü yap
    const token = localStorage.getItem("token")

    if (token) {
      fetchUser(token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async (token: string) => {
    try {
      // Token ile kullanıcı bilgilerini al
      const response = await axios.get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setUser(response.data.user)
    } catch (error) {
      // Token geçersizse localStorage'dan sil
      localStorage.removeItem("token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", { username, password })
      const { access_token } = response.data

      localStorage.setItem("token", access_token)
      setUser(user)
      router.push("/")

      return { success: true }
    } catch (error) {
      throw new Error("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.")
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.post("http://127.0.0.1:8000/signup", { name, email, password })
      router.push("/login")

      return { success: true }
    } catch (error) {
      throw new Error("Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.")
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
