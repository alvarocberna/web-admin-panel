'use client'

import { useAuthStore } from '../store/auth.store'

/*
  Lee useAuthStore. 
  Viene a ser un patrón adaptador para useAuthStore, ocultando la implementación
  subyacente y edponiendo solo lo neccesario. De este modo mañana cambiamos
  zustand por redux, etc, solo modificamos useAuth y AuthProvider. Todos los
  otros componentes no se enteran que ha cambiado la librería de estado global.
*/

export function useAuth() {
  const { user, loading, error, isAuthenticated } = useAuthStore()
  return { user, loading, error, isAuthenticated }
}
