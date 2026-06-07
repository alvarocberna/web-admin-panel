'use client'
//ZUSTAND
import { create } from 'zustand'
//FEATURES
import { UsuarioEntity } from '@/features'

/*
  useAuthStore es un objeto singleton en memoria, o también un
  store global de Zustand. Es como un objeto JS que vive fuera del arbol de
  componentes. Cualquier componente puede leerlo/modificarlo, y cuando cambia
  React renderiza solo los que lo consumen.
  Actualmente es modificado por AuthProvider y leido por useAuth.
  */
/*
  Nota: Singleton: una sola instancia de un objeto en toda la app, y 
  cualquier pate del programa puede acceder a esa misma instancia
*/

interface AuthState {
  user: UsuarioEntity | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  setUser: (user: UsuarioEntity | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearAuth: () => set({ user: null, isAuthenticated: false, error: null, loading: false }),
}))
