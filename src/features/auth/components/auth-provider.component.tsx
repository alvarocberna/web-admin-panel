'use client'
//REACT
import { useEffect } from 'react'
//NEXT
import { useRouter } from 'next/navigation'
//FEATURES
import { useAuthStore } from '../store/auth.store'
import { UsuarioService } from '@/features/usuarios/services/usuario.service'

/* 
  Es el wrapper del layout del 'route group admin'. Esto siginifica que se monta una sola vez 
  al navegar por cualquier ruta protegida de admin. 
  Al ingresar a una ruta protegida, el layout monta AuthProvider, el cual ejecuta useEffect
  que hace GET del usuario, quedando disponible para todos los componentes children (rutas protegidas).
  Así, cualquier componente dentro del route group admin puede llamar useAuthStore y acceder 
  al user, sin tener que hacer un fetch individual.
*/

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { setUser, setLoading, setError } = useAuthStore()

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const user = await UsuarioService.getUsuario()
        setUser(user) //modifica el estado interno de zustand (o useAuthStore)
      } catch (err: any) {
        setError(err.message)
        if (err.message === 'Sesión expirada') {
          router.push('/')
        }
      } finally {
        setLoading(false)
      }
    }

    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>
}
