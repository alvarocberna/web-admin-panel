'use client'
import { useState, useEffect } from 'react';
import { ContenedorAdmin } from '@/shared';
import { UsuarioEntity } from '@/features';
import { UsuarioService } from '@/features/usuarios/services/usuario.service';

export default function Dashboard(){
    const [usuario, setUsuario] = useState<UsuarioEntity>()

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const data = await UsuarioService.getUsuario()
                setUsuario(data);
            } catch(error) {
                console.log("error: " + error)
            }
        }
        fetchUsuario();
    }, [])

    return (
        <ContenedorAdmin>
            <div className="card px-6 py-7 max-w-lg">
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mb-1">Bienvenido</p>
                <h2 className="text-xl font-semibold text-zinc-900">
                    {usuario?.nombre ? `${usuario.nombre} ${usuario.apellido ?? ''}` : usuario?.email ?? '—'}
                </h2>
                {usuario?.email && usuario?.nombre && (
                    <p className="text-sm text-zinc-500 mt-0.5">{usuario.email}</p>
                )}
            </div>
        </ContenedorAdmin>
    )
}
