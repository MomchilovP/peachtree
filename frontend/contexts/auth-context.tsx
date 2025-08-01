"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"

interface User {
  id: number
  username: string
  full_name?: string
  balance: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string, fullName?: string) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await apiClient.getCurrentUser() as User
        setUser(userData)
      } catch (error) {
        // User is not authenticated or token is invalid
        apiClient.clearToken()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login(username, password)
      apiClient.setToken(response.access_token)
      
      // Get user data after successful login
      const userData = await apiClient.getCurrentUser() as User
      setUser(userData)
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (username: string, password: string, fullName?: string): Promise<boolean> => {
    try {
      await apiClient.register(username, password, fullName)
      // Auto-login after registration
      return await login(username, password)
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }
  const refreshUser = async (): Promise<void> => {
    try {
      const userData = await apiClient.getCurrentUser() as User
      setUser(userData)
    } catch (error) {
      console.error('Failed to refresh user data:', error)
    }
  }

  const logout = () => {
    setUser(null)
    apiClient.clearToken()
    router.push("/login")
  }

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={{ user, login, register, logout, refreshUser, isLoading }}>{children}</AuthContext.Provider>
}
