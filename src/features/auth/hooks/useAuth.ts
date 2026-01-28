/**
 * Hook personalizado para manejar la autenticación del usuario
 * Este hook puede usarse en componentes cliente para verificar si el usuario está autenticado
 */

'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UsuarioService } from '@/features/usuarios/services/usuario.service';
import { UsuarioEntity } from '@/features/usuarios/entities/usuario.entity';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<UsuarioEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await UsuarioService.getUsuario();
        setUser(userData);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setUser(null);
        // Si hay error al obtener el usuario, redirigir al login
        if (err.message === 'Sesión expirada') {
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  return { user, loading, error, isAuthenticated: !!user };
}
